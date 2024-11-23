import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productData }) => {
    if (!isOpen || !productData) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%] shadow-lg">
        <h2 className="text-blue-900 text-xl font-bold mb-6">
          ¿Está seguro de eliminar este producto?
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center border-b border-gray-100 pb-3">
            <span className="text-gray-600 w-28 font-medium">ID</span>
            <span className="text-gray-800 flex-1">{productData.id}</span>
          </div>
          
          <div className="flex items-center border-b border-gray-100 pb-3">
            <span className="text-gray-600 w-28 font-medium">Nombre</span>
            <span className="text-gray-800 flex-1">{productData.nombre}</span>
          </div>
          
          <div className="flex items-center border-b border-gray-100 pb-3">
            <span className="text-gray-600 w-28 font-medium">Categoría</span>
            <span className="text-gray-800 flex-1">{productData.categoria}</span>
          </div>
          
          <div className="flex items-center border-b border-gray-100 pb-3">
            <span className="text-gray-600 w-28 font-medium">Precio</span>
            <span className="text-gray-800 flex-1">S/{productData.precio}</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-500 text-white rounded-md hover:opacity-90 transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;