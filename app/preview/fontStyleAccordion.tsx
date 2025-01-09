'use client'

import * as React from "react"
import { useState, useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useIframeRef } from "./realTimeHtml"
import { useFormContext } from "../context/formContext"


const fontOptions = [
    { name: 'Whitney', style: 'Whitney, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'},
    { name: 'Arial', style: 'Arial, sans-serif' },
    { name: 'Verdana', style: 'Verdana, sans-serif' },
    { name: 'Helvetica', style: 'Helvetica, sans-serif' },
    { name: 'Times New Roman', style: '"Times New Roman", serif' },
    { name: 'Georgia', style: 'Georgia, serif' },
    { name: 'Courier New', style: '"Courier New", monospace' },
    { name: 'Comic Sans MS', style: '"Comic Sans MS", cursive' },
]

export default function FontStylerAccordion() {
    const [currentFont, setCurrentFont] = useState(fontOptions[0].style)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const iframeRef = useIframeRef()
    const { updateFormData } = useFormContext()

    const changeFont = (value: string) => {
        setCurrentFont(value);
        console.log(isLoading,error)
    };

    useEffect(() => {
        const applyFont = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const iframe = iframeRef.current;
                if (!iframe?.contentWindow) {
                    throw new Error("Iframe not found or not loaded yet");
                }
                const iframeDocument = iframe.contentWindow.document;
        
                const element = iframeDocument.getElementById("body-background-color");
                if (!element) {
                    throw new Error("Target element not found in iframe");
                }
            
                element.style.fontFamily = currentFont;
                updateFormData("font", currentFont);
            } catch (err) {
                console.error("Error applying font:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        // Delay the execution of applyFont to ensure iframe is loaded
        const timer = setTimeout(() => {
            applyFont();
        }, 500);

        return () => clearTimeout(timer);
    }, [currentFont, iframeRef,updateFormData]);

    return (
        <div className="relative">
            <Select onValueChange={changeFont} value={currentFont}>
                <SelectTrigger className="ml-2 w-[73px]" aria-label="Select font">
                    <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fonts</SelectLabel>
                        {fontOptions.map((font) => (
                            <SelectItem
                                key={font.name}
                                value={font.style}
                                className="p-4 bg-white m-2 rounded cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                                style={{ fontFamily: font.style }}
                            >
                                {font.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
          
        </div>
    )
}

