import React, { useState, useEffect } from "react";
import { 
  FileText, FileBarChart, 
  File as FileIcon, Download, 
  Paperclip, Loader2,
  ExternalLink, FileSpreadsheet,
  FileCheck2, FileArchive
} from "lucide-react";
import { motion } from "framer-motion";

interface FileCardProps {
  url: string;
  label?: string;
}

export const FileCard = ({ url, label }: FileCardProps) => {
  const [data, setData] = useState({ 
    title: label || "", 
    loading: !label && !!url 
  });

  useEffect(() => {
    const fetchInfo = async () => {
      if (!url || label) {
        if (label && data.loading) setData(prev => ({ ...prev, loading: false }));
        return;
      }
      
      try {
        const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&prerender=true`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.status === "success" && result.data.title) {
          setData({
            title: result.data.title,
            loading: false,
          });
        } else {
          setData(prev => ({ ...prev, loading: false }));
        }
      } catch (e) {
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchInfo();
  }, [url, label]);

  const getFileIcon = (link: string) => {
    const lowUrl = link.toLowerCase();
    if (lowUrl.includes("/document/") || lowUrl.endsWith(".doc") || lowUrl.endsWith(".docx")) 
      return <FileText className="text-indigo-500" size={20} />;
    if (lowUrl.includes("/presentation/") || lowUrl.endsWith(".ppt") || lowUrl.endsWith(".pptx")) 
      return <FileBarChart className="text-amber-500" size={20} />;
    if (lowUrl.includes("/spreadsheets/") || lowUrl.endsWith(".xls") || lowUrl.endsWith(".xlsx") || lowUrl.endsWith(".csv")) 
      return <FileSpreadsheet className="text-emerald-500" size={20} />;
    if (lowUrl.endsWith(".pdf")) 
      return <FileIcon className="text-rose-500" size={20} />;
    if (lowUrl.match(/\.(zip|7z|rar|tar|gz)$/)) 
      return <FileArchive className="text-violet-500" size={20} />;
    if (lowUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) 
      return <FileCheck2 className="text-blue-500" size={20} />;
    
    return <FileText className="text-slate-400" size={20} />;
  };

  return (
    <motion.a 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center justify-between p-3.5 bg-white hover:bg-indigo-50/30 transition-all rounded-2xl w-full cursor-pointer group shadow-sm border border-slate-100 hover:border-indigo-100 no-underline"
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        {/* Soft Background Icon Box */}
        <div className="flex items-center justify-center w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-sm transition-all flex-shrink-0">
          {data.loading ? (
            <Loader2 className="animate-spin text-slate-300" size={18} />
          ) : (
            getFileIcon(url)
          )}
        </div>

        {/* Intelligence Meta */}
        <div className="flex flex-col overflow-hidden">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 group-hover:text-indigo-400">Resource File</p>
           <span className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
            {data.loading ? "Analyzing..." : (data.title || "Institutional Asset")}
           </span>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex items-center gap-3 pl-3">
         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
            <ExternalLink size={14} />
         </div>
         <div className="w-8 h-8 rounded-lg bg-indigo-50 hidden md:flex items-center justify-center text-indigo-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
            <Download size={14} />
         </div>
      </div>
    </motion.a>
  );
};