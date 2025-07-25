"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, CheckCircle, XCircle, AlertTriangle, Trash2, Eye, Download } from "lucide-react"
import { validateFileUpload } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
  url?: string
}

interface ResumeUploadProps {
  onUploadComplete?: (fileUrl: string) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  className?: string
}

export function ResumeUpload({ onUploadComplete, onUploadError, maxFiles = 1, className = "" }: ResumeUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles: UploadedFile[] = []

      for (let i = 0; i < selectedFiles.length && newFiles.length < maxFiles; i++) {
        const file = selectedFiles[i]
        const validation = validateFileUpload(file)

        if (!validation.valid) {
          onUploadError?.(validation.error || "Invalid file")
          continue
        }

        newFiles.push({
          id: `${Date.now()}-${i}`,
          file,
          progress: 0,
          status: "uploading",
        })
      }

      if (newFiles.length === 0) return

      setFiles((prev) => [...prev.slice(0, maxFiles - newFiles.length), ...newFiles])
      uploadFiles(newFiles)
    },
    [maxFiles, onUploadError],
  )

  const uploadFiles = async (filesToUpload: UploadedFile[]) => {
    setIsUploading(true)

    for (const fileData of filesToUpload) {
      try {
        await uploadSingleFile(fileData)
      } catch (error) {
        console.error("Upload failed:", error)
        updateFileStatus(fileData.id, "error", error instanceof Error ? error.message : "Upload failed")
      }
    }

    setIsUploading(false)
  }

  const uploadSingleFile = async (fileData: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate file upload with progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30

        if (progress >= 100) {
          clearInterval(interval)
          progress = 100

          // Simulate upload completion
          setTimeout(() => {
            const success = Math.random() > 0.1 // 90% success rate for demo

            if (success) {
              const mockUrl = `https://storage.example.com/resumes/${fileData.id}-${fileData.file.name}`
              updateFileStatus(fileData.id, "success", undefined, mockUrl)
              onUploadComplete?.(mockUrl)
              resolve()
            } else {
              const error = "Upload failed. Please try again."
              updateFileStatus(fileData.id, "error", error)
              onUploadError?.(error)
              reject(new Error(error))
            }
          }, 500)
        } else {
          updateFileProgress(fileData.id, Math.min(progress, 95))
        }
      }, 200)
    })
  }

  const updateFileProgress = (id: string, progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress } : file)))
  }

  const updateFileStatus = (id: string, status: UploadedFile["status"], error?: string, url?: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status, error, url, progress: status === "success" ? 100 : file.progress } : file,
      ),
    )
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const retryUpload = (fileData: UploadedFile) => {
    const updatedFile = { ...fileData, status: "uploading" as const, progress: 0, error: undefined }
    setFiles((prev) => prev.map((file) => (file.id === fileData.id ? updatedFile : file)))
    uploadFiles([updatedFile])
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return <File className="h-8 w-8 text-blue-600" />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50",
          isDragOver ? "border-primary bg-primary/5" : "border-gray-300",
          isUploading && "pointer-events-none opacity-75",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div
              className={cn(
                "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                isDragOver ? "bg-primary text-white" : "bg-gray-100 text-gray-400",
              )}
            >
              <Upload className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {isDragOver ? "Drop your resume here" : "Upload your resume"}
              </h3>
              <p className="text-gray-600">
                Drag and drop your file here, or <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={maxFiles > 1}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload resume file"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {files.map((fileData) => (
            <Card key={fileData.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{getFileIcon(fileData.file.name)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{fileData.file.name}</p>
                    <div className="flex items-center space-x-2">
                      {fileData.status === "success" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(fileData.url, "_blank")}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a")
                              link.href = fileData.url || ""
                              link.download = fileData.file.name
                              link.click()
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileData.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{formatFileSize(fileData.file.size)}</span>
                    <div className="flex items-center space-x-2">
                      {fileData.status === "uploading" && <span>Uploading... {Math.round(fileData.progress)}%</span>}
                      {fileData.status === "success" && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Uploaded</span>
                        </div>
                      )}
                      {fileData.status === "error" && (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>Failed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {fileData.status === "uploading" && <Progress value={fileData.progress} className="h-2" />}

                  {fileData.status === "error" && fileData.error && (
                    <Alert className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <span>{fileData.error}</span>
                        <Button variant="outline" size="sm" onClick={() => retryUpload(fileData)} className="ml-2">
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Upload Guidelines:</strong> Ensure your resume is up-to-date and includes relevant keywords for your
          target positions. Supported formats: PDF (recommended), DOC, DOCX. Maximum file size: 5MB.
        </AlertDescription>
      </Alert>
    </div>
  )
}
