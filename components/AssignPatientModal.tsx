import React, { useState, useMemo, useEffect } from 'react';

interface AssignPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientId: string) => void;
  existingPatientIds: string[];
}

const AssignPatientModal: React.FC<AssignPatientModalProps> = ({ isOpen, onClose, onSubmit, existingPatientIds }) => {
  const [patientId, setPatientId] = useState('');

  const uniquePatientIds = useMemo(() => [...new Set(existingPatientIds)], [existingPatientIds]);

  useEffect(() => {
    if (!isOpen) {
      setPatientId('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      onSubmit(patientId.trim().toUpperCase());
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Assign to Patient</h2>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-600 mb-2">
            Enter a new Patient ID or select an existing one from the list.
          </p>
          <input
            type="text"
            list="patient-ids"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="e.g., P123"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            autoFocus
            required
          />
          <datalist id="patient-ids">
            {uniquePatientIds.map(id => <option key={id} value={id} />)}
          </datalist>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400"
              disabled={!patientId.trim()}
            >
              Create Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPatientModal;