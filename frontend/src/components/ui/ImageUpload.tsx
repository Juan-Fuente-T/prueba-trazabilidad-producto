interface ImageUploadProps {
    file: File | null
    onFileChange: (file: File | null) => void
}

export default function ImageUpload({ file, onFileChange }: ImageUploadProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Imagen del lote</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 hover:bg-gray-50 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                    {file ? (
                        <div className="text-emerald-600 font-semibold flex flex-col items-center">
                            <span className="text-2xl">📎</span>
                            <span>{file.name}</span>
                            <span className="text-xs text-gray-400 mt-1">(Clic para cambiar)</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <span className="text-3xl mb-2">☁️</span>
                            <p className="font-medium">Arrastra tu imagen</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}