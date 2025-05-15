import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-4xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
            <p className="text-lg mb-6">You do not have permission to view this page.</p>
            <Link to="/" className="text-blue-500 hover:underline">
                ← Go back to Home
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
