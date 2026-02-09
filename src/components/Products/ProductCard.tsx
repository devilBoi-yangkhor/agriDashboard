"use client";

import { Product } from "@/types/product/Product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  getImageUrl: (path?: string) => string;
}

const ProductCard = ({ product, onEdit, onView, onDelete, getImageUrl }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        {product.photos?.[0] ? (
          <img
            src={getImageUrl(product.photos[0])}
            alt={product.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-800">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-1 font-semibold">{product.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {product.description}
        </p>
        <div className="mb-3">
          {typeof product.category === 'object' && (product.category as any)?.name && (
            <Badge variant="secondary" className="mr-2">
              {(product.category as any).name}
            </Badge>
          )}
          {product.organic && (
            <Badge variant="outline" className="border-green-600 text-green-600">
              Organic
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Nu. {parseFloat(product.price as any).toFixed(2)}</div>
            <div className="text-xs text-gray-500">
              Stock: {product.stock} {typeof product.unit === 'object' ? (product.unit as any)?.name : ''}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" onClick={onView} className="flex-1">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button variant="default" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;