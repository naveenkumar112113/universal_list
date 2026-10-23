import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Layers, 
  FileSpreadsheet, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sparkles,
  Check,
  AlertTriangle
} from 'lucide-react';
import type { BulkImportProgressData } from '../../services/api';

interface BulkImportProgressBarProps {
  progressData: BulkImportProgressData;
  isProcessing: boolean;
  onReset?: () => void;
  onCancel?: () => void;
  fileName?: string;
}

export const BulkImportProgressBar: React.FC<BulkImportProgressBarProps> = ({
  progressData,
  isProcessing,
  onReset,
  onCancel,
  fileName,
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const {
    total = 0,
    inserted = 0,
    newModels = 0,
    duplicates = 0,
    failed = 0,
    progress = 0,
    status = 'processing',
    currentModel,
    message,
    errors = [],
  } = progressData;

  const isCompleted = status === 'completed' || (!isProcessing && progress === 100);
  const isFailed = status === 'failed';
  const hasErrors = failed > 0 || errors.length > 0;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-gray-50/80 to-white dark:from-[#0f172a]/90 dark:to-[#0b1329] border border-gray-200/80 dark:border-gray-800 p-5 sm:p-6 shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200/70 dark:border-gray-800/80">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${
            isFailed
              ? 'bg-rose-500/10 text-rose-500 dark:bg-rose-950/40'
              : isCompleted
              ? hasErrors
                ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-950/40'
                : 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/40'
              : 'bg-blue-500/10 text-blue-500 dark:bg-blue-950/40'
          }`}>
            {isFailed ? (
              <XCircle className="w-5 h-5" />
            ) : isCompleted ? (
              hasErrors ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />
            ) : (
              <RefreshCw className="w-5 h-5 animate-spin" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Bulk Import Progress
              </h4>
              {fileName && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-gray-200/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 truncate max-w-[160px] sm:max-w-[220px]">
                  {fileName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isCompleted
                ? hasErrors
                  ? 'Import finished with warnings.'
                  : 'Import completed successfully.'
                : isFailed
                ? 'Import process stopped due to an error.'
                : currentModel
                ? `Inserting model: ${currentModel}`
                : 'Processing CSV dataset in real-time...'}
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-2">
          {isProcessing ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
              <span>Live Importing</span>
            </span>
          ) : isCompleted ? (
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
              hasErrors
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
            }`}>
              <Check className="w-3.5 h-3.5" />
              <span>{hasErrors ? 'Completed with Warnings' : 'Completed 100%'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <XCircle className="w-3.5 h-3.5" />
              <span>Failed</span>
            </span>
          )}

          {isProcessing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 transition-colors"
            >
              Cancel
            </button>
          )}

          {!isProcessing && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Import Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        {/* Total Records */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#111c38] border border-gray-100 dark:border-gray-800/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Records</span>
            <Layers className="w-4 h-4 text-purple-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
            {total.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">Records in CSV</span>
        </div>

        {/* Inserted Records */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#111c38] border border-emerald-100 dark:border-emerald-950/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Inserted Records</span>
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
            {inserted.toLocaleString()}
          </div>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <span className="text-[10px] text-gray-400">
              {total > 0 ? `${Math.round((inserted / total) * 100)}% of total` : 'Successfully saved'}
            </span>
            {(newModels > 0 || duplicates > 0) && (
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                {newModels} new{duplicates > 0 ? ` · ${duplicates} duplicates merged` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Failed / Errors (or Status if none failed) */}
        <div className={`col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white dark:bg-[#111c38] border shadow-xs flex flex-col justify-between ${
          failed > 0
            ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20'
            : 'border-gray-100 dark:border-gray-800/80'
        }`}>
          <div className={`flex items-center justify-between mb-1 ${
            failed > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {failed > 0 ? 'Failed Records' : 'Import Status'}
            </span>
            {failed > 0 ? (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-blue-500 shrink-0" />
            )}
          </div>
          <div className={`text-xl sm:text-2xl font-black tabular-nums tracking-tight ${
            failed > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'
          }`}>
            {failed > 0 ? failed.toLocaleString() : isCompleted ? '100% Done' : `${progress}%`}
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">
            {failed > 0 ? 'Skipped or invalid rows' : isProcessing ? 'Actively importing' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Duplicate notice if any duplicate models were detected and merged */}
      {duplicates > 0 && (
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            <strong>{duplicates.toLocaleString()} duplicate model row{duplicates > 1 ? 's' : ''} merged:</strong> Existing database records updated with new compatibilities without creating duplicate model entries.
          </span>
        </div>
      )}

      {/* Visual Progress Bar Track */}
      <div className="space-y-2 mt-4 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="relative w-full h-3.5 sm:h-4 bg-gray-200/80 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out relative ${
              isFailed
                ? 'bg-rose-500'
                : isCompleted
                ? hasErrors
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500'
            }`}
            style={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
          >
            {/* Shimmer animation while processing */}
            {isProcessing && (
              <div 
                className="absolute inset-0 bg-white/25 rounded-full animate-pulse"
                style={{
                  backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem'
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Completion Banner Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2.5 ${
          isFailed
            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60'
            : isCompleted
            ? hasErrors
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60'
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60'
            : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60'
        }`}>
          {isFailed ? (
            <XCircle className="w-4 h-4 shrink-0" />
          ) : isCompleted ? (
            hasErrors ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Sparkles className="w-4 h-4 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
          )}
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Expandable Errors List */}
      {errors && errors.length > 0 && (
        <div className="mt-4 border-t border-gray-100 dark:border-gray-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="w-full flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed Rows Details ({errors.length} record{errors.length > 1 ? 's' : ''})</span>
            </span>
            {showErrorDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showErrorDetails && (
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1.5 rounded-xl p-2.5 bg-gray-50 dark:bg-gray-900/90 border border-gray-200/60 dark:border-gray-800 text-[11px]">
              {errors.map((err, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start justify-between py-1 px-2 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 gap-2"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-mono text-gray-500 font-bold shrink-0">Row {err.row}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {err.name || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 text-right shrink-0">
                    {err.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
