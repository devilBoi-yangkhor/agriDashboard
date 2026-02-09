"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { debounce, set } from "lodash";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Permission {
  id: number;
  codename: string;
  name: string;
  model: string;
  roleAssignments: Record<string, boolean>;
}

interface Role {
  id: number;
  name: string;
}

interface ModelGroup {
  model: string;
  permissions: Permission[];
}

const PermissionTable = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});

  const formatCategoryName = useCallback((str: string): string => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  }, []);

  const formatModelName = useCallback((model: string): string => {
    const parts = model.split(".");
    const modelName = parts[1] || parts[0];
    return formatCategoryName(modelName.replace(/model$/, ""));
  }, [formatCategoryName]);

  const initializeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/user-management/bulk-update/");
      const jsonData = res.data;

      // Map roles
      const mappedRoles: Role[] = jsonData.data.map((role: any, index: number) => ({
        id: index + 1,
        name: role.name,
      }));

      // Collect all unique permissions across all models
      const permissionMap: Record<string, Permission> = {};
      let permissionId = 1;

      jsonData.data.forEach((role: any) => {
        role.permissions.forEach((modelPerm: any) => {
          Object.keys(modelPerm.permissions).forEach((codename) => {
            const key = `${modelPerm.model}.${codename}`;
            if (!permissionMap[key]) {
              permissionMap[key] = {
                id: permissionId++,
                codename,
                name: `${codename.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}`,
                model: modelPerm.model,
                roleAssignments: {},
              };
            }
          });
        });
      });

      // Map permissions with role assignments
      const mappedPermissions: Permission[] = Object.values(permissionMap).map((perm) => ({
        ...perm,
        roleAssignments: mappedRoles.reduce((acc, role) => {
          const roleData = jsonData.data.find((r: any) => r.name === role.name);
          let isAssigned = false;
          if (roleData) {
            const modelPerm = roleData.permissions.find((p: any) => p.model === perm.model);
            if (modelPerm) {
              isAssigned = modelPerm.permissions[perm.codename as keyof typeof modelPerm.permissions];
            }
          }
          return { ...acc, [String(role.id)]: isAssigned };
        }, {} as Record<string, boolean>),
      }));

      // Initialize expanded state for all models
      const initialExpanded = mappedPermissions.reduce((acc, perm) => {
        acc[perm.model] = true; // Default to expanded
        return acc;
      }, {} as Record<string, boolean>);

      setRoles(mappedRoles);
      setPermissions(mappedPermissions.sort((a, b) => a.model.localeCompare(b.model) || a.id - b.id));
      setExpandedModels(initialExpanded);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Group permissions by model
  const groupedPermissions = useMemo(() => {
    const groups: ModelGroup[] = [];
    const modelMap: Record<string, Permission[]> = {};

    permissions.forEach((perm) => {
      if (!modelMap[perm.model]) {
        modelMap[perm.model] = [];
      }
      modelMap[perm.model].push(perm);
    });

    Object.keys(modelMap).forEach((model) => {
      groups.push({
        model,
        permissions: modelMap[model],
      });
    });

    return groups.sort((a, b) => a.model.localeCompare(b.model));
  }, [permissions]);

  const debouncedHandleCheckboxChange = useMemo(
    () =>
      debounce(
        (
          permissionId: number | null,
          roleId: string,
          checkAllValue: boolean | null = null
        ) => {
          setPermissions((prevPermissions) =>
            prevPermissions.map((perm) => {
              if (permissionId === null || perm.id === permissionId) {
                return {
                  ...perm,
                  roleAssignments: {
                    ...perm.roleAssignments,
                    [roleId]:
                      checkAllValue !== null
                        ? checkAllValue
                        : !perm.roleAssignments[roleId],
                  },
                };
              }
              return perm;
            })
          );
        },
        300
      ),
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      // Construct the payload in the required format
      const payload = roles.map((role) => {
        const rolePermissions = groupedPermissions.map((group) => {
          const permissionsForModel: Record<string, boolean> = {};
          group.permissions.forEach((perm) => {
            permissionsForModel[perm.codename] = perm.roleAssignments[String(role.id)] || false;
          });
          return {
            model: group.model,
            permissions: permissionsForModel,
          };
        });
        return {
          name: role.name,
          permissions: rolePermissions,
        };
      });

      await api.post("/user-management/bulk-update/", {data: payload}).finally(() => setIsLoading(false));
      setError(null);
      toast.success("Permissions updated successfully!");
    } catch (error) {
      toast.error("Error submitting permissions.");
      setError("Failed to update permissions. Please try again.");
    }
  }, [permissions, roles]);

  const handleCheckAll = useCallback(
    (roleId: string) => {
      const allChecked = permissions.every(
        (perm) => perm.roleAssignments[roleId]
      );
      debouncedHandleCheckboxChange(null, roleId, !allChecked);
    },
    [permissions, debouncedHandleCheckboxChange]
  );

  const isRoleChecked = useCallback(
    (roleId: string) => {
      return permissions.every((perm) => perm.roleAssignments[roleId]);
    },
    [permissions]
  );

  const toggleModel = useCallback((model: string) => {
    setExpandedModels((prev) => ({
      ...prev,
      [model]: !prev[model],
    }));
  }, []);

  useEffect(() => {
    initializeData();
    return () => {
      debouncedHandleCheckboxChange.cancel();
    };
  }, [initializeData, debouncedHandleCheckboxChange]);

  if (error) {
    return (
      <div
        className="p-4 text-center text-red-600 bg-red-50 rounded-lg"
        role="alert"
      >
        {error}
        <button
          className="ml-4 text-blue-600 underline"
          onClick={() => {
            setError(null);
            initializeData();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <div className="p-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              Update
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 sticky left-0 bg-gray-50">
                  Permission
                </TableHead>
                {roles.map((role) => (
                  <TableHead
                    key={role.id}
                    className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-600"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span>{formatCategoryName(role.name)}</span>
                      <input
                        type="checkbox"
                        checked={isRoleChecked(String(role.id))}
                        onChange={() => handleCheckAll(String(role.id))}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        aria-label={`Toggle all permissions for ${role.name}`}
                        title={`Toggle all for ${role.name}`}
                      />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedPermissions.map((group) => (
                <React.Fragment key={group.model}>
                  <TableRow className="bg-gray-100">
                    <TableCell
                      colSpan={roles.length + 1}
                      className="px-6 py-4 text-sm font-semibold text-gray-900 sticky left-0 bg-gray-100 cursor-pointer"
                      onClick={() => toggleModel(group.model)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedModels[group.model] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span>{formatModelName(group.model)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedModels[group.model] &&
                    group.permissions.map((perm) => (
                      <TableRow
                        key={perm.id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <TableCell className="px-6 py-4 pl-10 text-sm text-gray-900 font-medium sticky left-0 bg-white">
                          {perm.name}
                        </TableCell>
                        {roles.map((role) => (
                          <TableCell
                            key={`${perm.id}-${role.id}`}
                            className="px-6 py-4 text-center"
                          >
                            <input
                              type="checkbox"
                              checked={perm.roleAssignments[String(role.id)] || false}
                              onChange={() =>
                                debouncedHandleCheckboxChange(perm.id, String(role.id))
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              aria-label={`Toggle ${perm.name} for ${role.name}`}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default PermissionTable;