'use client'
import React, { useState, useEffect } from "react";
import { Query, HistoryItem } from "@/types/Query";
import moment from "moment";
import { getEnquiryHistory } from "@/services/QueryService";

interface ChangeData {
  [key: string]: [any, any];
}

const QueryDetailView = ({ query }: { query: Query }) => {
  const [enquiryHistory, setEnquiryHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchEnquiryHistory = async () => {
      try {
        const response = await getEnquiryHistory(query.id);
        setEnquiryHistory(response);
      } catch (error) {
        console.error("Error fetching enquiry history:", error);
      }
    }
    fetchEnquiryHistory();
  }, [query.id]);

  const formatFieldName = (field: string) => {
    return field.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatValue = (value: any, field: string) => {
    if (value === null || value === undefined) return null;
    if (value === '') return null;
    
    // Handle special formatted strings
    if (typeof value === 'string' && value.includes(' - ') && value.includes(' (ParentID: ')) {
      return value.split(' - ')[1].split(' (')[0];
    }
    
    // Handle array values
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : null;
    }
    
    // Handle date strings
    if (field.includes('date') || field.includes('_at')) {
      return moment(value).format("DD MMM YYYY hh:mm A");
    }
    
    return value.toString();
  };

  const renderChangeItem = (field: string, oldValue: any, newValue: any, isCreation: boolean) => {
    if (field === 'updated_at' || field === 'created_at') return null;
    
    const formattedOldValue = formatValue(oldValue, field);
    const formattedNewValue = formatValue(newValue, field);
    
    // Skip if no new value to show
    if (!formattedNewValue) return null;

    const isStatusChange = field === 'status';
    const isRemarksChange = field === 'remarks';
    const isQueryChange = field === 'query';

    // For creation, only show the new value without comparison
    if (isCreation) {
      return (
        <li key={field} className="mb-2">
          <div className="flex flex-wrap items-baseline">
            <span className="font-medium mr-2">{formatFieldName(field)}:</span>
            {isStatusChange ? (
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                {formattedNewValue}
              </span>
            ) : isRemarksChange || isQueryChange ? (
              <span className="text-gray-600">{formattedNewValue}</span>
            ) : (
              <span className="text-gray-600">{formattedNewValue}</span>
            )}
          </div>
        </li>
      );
    }

    // For updates, show the comparison
    return (
      <li key={field} className="mb-2">
        <div className="flex flex-wrap items-baseline">
          <span className="font-medium mr-2">{formatFieldName(field)}:</span>
          {isStatusChange ? (
            <>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800 mr-1">
                {formattedOldValue}
              </span>
              <span className="text-gray-500 text-xs mr-1">→</span>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                {formattedNewValue}
              </span>
            </>
          ) : isRemarksChange || isQueryChange ? (
            <>
              <span className="text-gray-600 line-through mr-1">{formattedOldValue}</span>
              <span className="text-gray-500 text-xs mr-1">→</span>
              <span className="text-gray-600">{formattedNewValue}</span>
            </>
          ) : (
            <>
              <span className="text-gray-600 line-through mr-1">{formattedOldValue}</span>
              <span className="text-gray-500 text-xs mr-1">→</span>
              <span className="text-gray-600">{formattedNewValue}</span>
            </>
          )}
        </div>
      </li>
    );
  };

  const renderHistoryItem = (item: HistoryItem, index: number) => {
    const changes: ChangeData = JSON.parse(item.changes);
    const isCreation = item.action === 0;
    const date = moment(item.timestamp).format("DD MMM YYYY");
    const time = moment(item.timestamp).format("hh:mm A");

    // For creation, show all fields that have a new value
    // For updates, only show fields that actually changed
    const filteredChanges = isCreation 
      ? Object.entries(changes).filter(([, [, newVal]]) => formatValue(newVal, '') !== null)
      : Object.entries(changes)
          .filter(([field]) => field !== 'updated_at' && field !== 'created_at')
          .filter(([, [oldVal, newVal]]) => oldVal !== newVal && formatValue(newVal, '') !== null);

    if (filteredChanges.length === 0) return null;

    return (
      <div key={index} className="relative pl-8 pb-8 border-l-2 border-blue-200 group">
        <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white ${
          isCreation ? 'bg-green-500' : 'bg-blue-500'
        }`}></div>

        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 w-fit">
              {isCreation ? 'Enquiry Created' : `Update`} #ENQ-v{query.id}.{enquiryHistory.length - index - 1}
            </span>
            <span className="text-sm text-gray-500">
              {isCreation ? 'Created' : 'Updated'} on {date} at {time}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isCreation ? 'New Enquiry Created' : 'Enquiry Details Updated'}
          </h3>

          <div className="mb-3">
            <ul className="text-sm text-gray-600 space-y-3">
              {filteredChanges.map(([field, [oldValue, newValue]]) => 
                renderChangeItem(field, oldValue, newValue, isCreation)
              )}
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <span>{isCreation ? 'Created' : 'Updated'} by:</span>
            <span className="font-medium text-gray-700 ml-1">
              {item.actor || 'System'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shadow-xs mx-auto max-w-full rounded-lg border border-gray-100 bg-white p-5">
      <div className="max-w-full mx-auto p-6">
        <div className="space-y-8">
          {enquiryHistory?.length > 0 ? (
            enquiryHistory.map((item, index) => renderHistoryItem(item, index))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No history available for this enquiry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QueryDetailView;