"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const BusinessCard = () => {
    const [businessInfo, setBusinessInfo] = useState({
        name: '',
        phone: '',
        address: '',
        website: '',
        logo: null,
        frontContent: 'name',
        cardCorners: 'sharp',
        frontFont: 'Arial, sans-serif',
        backFont: 'Arial, sans-serif',
        qrCode: null,
    });

    const [selectedTemplate, setSelectedTemplate] = useState('template1');
    const frontCardRef = useRef(null);
    const backCardRef = useRef(null);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);

    useEffect(() => {
        if (businessInfo.website) {
            let qrColor = "#000";
            if (selectedTemplate === 'template3') {
                qrColor = "#4CAF50";
            } else if (selectedTemplate === 'template4') {
                qrColor = "#fff";
            }
            QRCode.toDataURL(businessInfo.website, {
                color: {
                    dark: qrColor,
                    light: "#0000",
                },
            }, (err, url) => {
                if (err) {
                    console.error(err);
                    return;
                }
                setBusinessInfo(prev => ({ ...prev, qrCode: url }));
            });
        }
    }, [businessInfo.website, selectedTemplate]);

    useEffect(() => {
        const generateImages = async () => {
            if (frontCardRef.current && backCardRef.current) {
                try {
                    const frontCanvas = await html2canvas(frontCardRef.current);
                    const backCanvas = await html2canvas(backCardRef.current);

                    setFrontImage(frontCanvas.toDataURL('image/png'));
                    setBackImage(backCanvas.toDataURL('image/png'));
                } catch (error) {
                    console.error("Error generating images:", error);
                }
            }
        };

        generateImages();
    }, [businessInfo, selectedTemplate]);

    const handleChange = (e) => {
        if (e.target.name === 'logo') {
            setBusinessInfo({ ...businessInfo, logo: e.target.files[0] });
        } else {
            setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
        }
    };

    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
    };

    const handleFrontContentChange = (e) => {
        setBusinessInfo({ ...businessInfo, frontContent: e.target.value });
    };

    const handleCardCornersChange = (e) => {
        setBusinessInfo({ ...businessInfo, cardCorners: e.target.value });
    };

    const handleFrontFontChange = (e) => {
        setBusinessInfo({ ...businessInfo, frontFont: e.target.value });
    };

    const handleBackFontChange = (e) => {
        setBusinessInfo({ ...businessInfo, backFont: e.target.value });
    };

    const getTemplateStyles = (template, isFront) => {
        if (template === 'template1') {
            return { backgroundColor: 'white', color: 'black' };
        }
        if (template === 'template4') {
            return { backgroundColor: isFront ? 'white' : 'black', color: isFront ? 'black' : 'white' };
        }
        if (template === 'template2') {
            return { backgroundColor: 'white', color: 'blue' };
        }
        switch (template) {
            case 'template3':
                return { backgroundColor: '#e8f5e9', color: '#1b5e20' };
            default:
                return { backgroundColor: 'white', color: 'black' };
        }
    };

    const downloadImage = (imageUrl, filename) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTemplatePreview = (template) => {
        const styles = getTemplateStyles(template, true);
        return (
            <div className="flex flex-col items-center gap-2">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="template"
                        value={template}
                        checked={selectedTemplate === template}
                        onChange={handleTemplateChange}
                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{`Template ${template.slice(-1)}`}</span>
                </label>
                <div className="flex items-center justify-center gap-2">
                    <div className="border p-2 rounded-md" style={{ ...styles, width: '60px', height: '40px' }}>
                        <p className="text-xs text-center">Front</p>
                    </div>
                    <div className="border p-2 rounded-md" style={{ ...getTemplateStyles(template, false), width: '60px', height: '40px' }}>
                        <p className="text-xs text-center">Back</p>
                    </div>
                </div>
            </div>
        );
    };

    const fontOptions = [
        'Arial, sans-serif',
        'Helvetica, sans-serif',
        'Verdana, sans-serif',
        'Times New Roman, serif',
        'Georgia, serif',
    ];

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F]">
                <h1 className="text-lg font-semibold mb-4">Business Card</h1>

                <div className="flex flex-col gap-4">
                    <input type="text" name="name" value={businessInfo.name} onChange={handleChange} placeholder="Business Name" className="p-2 border rounded" />
                    <input type="tel" name="phone" value={businessInfo.phone} onChange={handleChange} placeholder="Phone Number" className="p-2 border rounded" />
                    <input type="text" name="address" value={businessInfo.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
                    <input type="url" name="website" value={businessInfo.website} onChange={handleChange} placeholder="Website" className="p-2 border rounded" />

                    <label className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer">
                        Choose Logo
                        <input type="file" name="logo" onChange={handleChange} accept="image/*" className="hidden" />
                    </label>

                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="frontContent" value="name" checked={businessInfo.frontContent === 'name'} onChange={handleFrontContentChange} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm">Name</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="frontContent" value="logo" checked={businessInfo.frontContent === 'logo'} onChange={handleFrontContentChange} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm">Logo</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="frontContent" value="both" checked={businessInfo.frontContent === 'both'} onChange={handleFrontContentChange} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm">Name & Logo</span>
                        </label>
                    </div>

                   

                    <div className="flex justify-between">
                        {renderTemplatePreview('template1')}
                        {renderTemplatePreview('template2')}
                        {renderTemplatePreview('template3')}
                        {renderTemplatePreview('template4')}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-semibold">Front Font</label>
                            <select value={businessInfo.frontFont} onChange={handleFrontFontChange} className="border p-2 rounded">
                                {fontOptions.map((font) => (
                                    <option key={font} value={font}>{font.split(',')[0]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-semibold">Back Font</label>
                            <select value={businessInfo.backFont} onChange={handleBackFontChange} className="border p-2 rounded">
                                {fontOptions.map((font) => (
                                    <option key={font} value={font}>{font.split(',')[0]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-4 border p-4 rounded-lg" style={{ backgroundColor: 'white', borderColor: 'black' }}>
                        <div className="flex gap-4">
                            <div ref={frontCardRef} className={`border p-4 ${businessInfo.cardCorners === 'rounded' ? 'rounded-lg' : 'rounded-md'}`} style={{ ...getTemplateStyles(selectedTemplate, true), width: '336px', height: '210px', fontFamily: businessInfo.frontFont }}>
                                <div className="relative h-full">
                                    {selectedTemplate === 'template2' && (
                                        <div className="absolute bottom-4 left-4">
                                            <h2 className="text-xl font-semibold">{businessInfo.name}</h2>
                                        </div>
                                    )}
                                    {selectedTemplate === 'template3' && (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <h2 className="text-2xl font-semibold">{businessInfo.name}</h2>
                                        </div>
                                    )}
                                    {(selectedTemplate === 'template1' || selectedTemplate === 'template4') && (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            {businessInfo.frontContent === 'logo' && businessInfo.logo && <img src={businessInfo.logo ? URL.createObjectURL(businessInfo.logo) : ''} alt="Logo" className="max-w-full max-h-full" />}
                                            {businessInfo.frontContent === 'name' && <h2 className="text-2xl font-semibold">{businessInfo.name}</h2>}
                                            {businessInfo.frontContent === 'both' && (
                                                <>
                                                    {businessInfo.logo && <img src={businessInfo.logo ? URL.createObjectURL(businessInfo.logo) : ''} alt="Logo" className="max-w-full max-h-full" />}
                                                    <h2 className="text-2xl font-semibold">{businessInfo.name}</h2>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div ref={backCardRef} className={`border p-4 ${businessInfo.cardCorners === 'rounded' ? 'rounded-lg' : 'rounded-md'}`} style={{ ...getTemplateStyles(selectedTemplate, false), width: '336px', height: '210px', fontFamily: businessInfo.backFont }}>
                                <div className="relative h-full">
                                    {selectedTemplate === 'template2' && (
                                        <div className="absolute bottom-4 right-4 text-right">
                                            <p>{businessInfo.phone}</p>
                                            <p>{businessInfo.website}</p>
                                        </div>
                                    )}
                                    {selectedTemplate === 'template3' && (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <p>{businessInfo.phone}</p>
                                            <p>{businessInfo.address}</p>
                                            <p>{businessInfo.website}</p>
                                            {businessInfo.qrCode && <img src={businessInfo.qrCode} alt="Website QR Code" className="w-20 mt-2" />}
                                        </div>
                                    )}
                                    {(selectedTemplate === 'template1' || selectedTemplate === 'template4') && (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <p>{businessInfo.phone}</p>
                                            <p>{businessInfo.address}</p>
                                            <p>{businessInfo.website}</p>
                                            {businessInfo.qrCode && selectedTemplate === 'template4' && <img src={businessInfo.qrCode} alt="Website QR Code" className="w-20 mt-2" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {frontImage && backImage && (
                            <div className="flex gap-4 mt-4">
                                <button onClick={() => downloadImage(frontImage, 'front_card.png')} className="bg-blue-500 text-white p-2 rounded">Download Front</button>
                                <button onClick={() => downloadImage(backImage, 'back_card.png')} className="bg-blue-500 text-white p-2 rounded">Download Back</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BusinessCard;