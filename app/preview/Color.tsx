"use client"

import { useEffect, useState } from 'react'
import { ColorPicker } from './ColorPicker'
import { useIframeRef } from './realTimeHtml'
import { useFormContext } from '../context/formContext'

interface ColorPickerProps {
  elementId: string
}

export default function ColorPickerComp({ elementId }: ColorPickerProps) {
    const [color, setColor] = useState({ h: 0, s: 100, v: 100 })
    const iframeRef = useIframeRef()
    const { formData, updateFormData } = useFormContext()

    const handleColorChange = (newColor: { h: number; s: number; v: number }) => {
        setColor(newColor)
    }

    //  Function to convert HSV to HEX
    const hsvToHex = (hue: number, saturation: number, value: number): string => {
        // Convert Hue, Saturation, and Value to a scale of 0 to 1
        const h = hue / 360;
        const s = saturation / 100;
        const v = value / 100;

        // Convert HSV to RGB
        const rgbToHex = (r: number, g: number, b: number): string =>
            `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = Math.round(v * (1 - s) * 255);
        const q = Math.round(v * (1 - f * s) * 255);
        const t = Math.round(v * (1 - (1 - f) * s) * 255);
        const r = Math.round(v * 255);
        const g = [t, q, p, p, q, t][i % 6];
        const b = [p, p, q, t, t, q][i % 6];

        return rgbToHex(r, g, b);
    };

    const hexColor = hsvToHex(color.h,color.s, color.v);

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const iframeDocument = iframe.contentWindow.document;
  
      const element = iframeDocument.getElementById(elementId);
      if (element) {
          element.style.backgroundColor = hexColor;
          updateFormData(`${elementId}`,hexColor)
      }
  }, [hexColor, iframeRef, elementId])

 


    return (
        <>
 <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Color Picker</h1>
        <ColorPicker onChange={handleColorChange} />
        <div className="mt-4">
          <p>Selected Color:</p>
          <div
            className="w-full h-12 rounded mt-2"
            style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.v}%)` }}
          ></div>
          <p className="mt-2">
          </p>
        </div>
      </div>
    </div>
        </>
    )
}

