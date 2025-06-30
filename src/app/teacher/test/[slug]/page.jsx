'use client'

import { useEffect, useState } from "react";


export default function Test({params}) {
    const testId = params.slug;
    return (
        <div>
            <p>Test ID: {testId}</p>
        </div>
    )
}