import React from 'react';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div
            className="w-16 h-16 border-4 border-blue-600 border-solid rounded-full animate-spin"
            style={{ borderTopColor: 'transparent' }}
        ></div>
    </div>
);

export default Spinner;
