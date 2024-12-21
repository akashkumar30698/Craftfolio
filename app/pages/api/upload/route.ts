import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  liveLink: string;
  repoLink: string;
}

async function uploadToCloudinary(file: File): Promise<{ secure_url: string; public_id: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            secure_url: result?.secure_url || '',
            public_id: result?.public_id || ''
          });
        }
      }
    );

    stream.pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    console.log('Received FormData entries:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    const photo = data.get('photo') as File | null;
    const resume = data.get('resume') as File | null;

    if (!photo || !resume) {
      console.log("Missing photo or resume:", photo, resume);
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    console.log("photo:", photo);

    const uploadResults = {
      mainPhoto: await uploadToCloudinary(photo),
      resume: await uploadToCloudinary(resume),
      projects: []
    };

    // Process projects
    const projects = [];
    let index = 1; 
    const temp = data.get(`project_1`);
    console.log("temp:", temp);

    while (data.get(`project_${index}`)) {
      const projectData = data.get(`project_${index}`) as File | null;
      console.log(`project_${index}:`, projectData);

      if  ( projectData) {
        const photoUpload = await uploadToCloudinary(projectData);
         projects.push({
          ...projectData,
          photo: photoUpload.secure_url
        });
      } else {
        projects.push(projectData);
      }

      index++;
    }

    // Process other form data
    const processedData: Record<string, any> = {};
    for (const [key, value] of data.entries()) {
      if (!['photo', 'resume'].includes(key) && !key.startsWith('project_') && !key.startsWith('project_photo_')) {
        try {
          processedData[key] = JSON.parse(value as string);
        } catch {
          processedData[key] = value;
        }
      }
    }

    const finalData = {
      ...processedData,
      photo: uploadResults.mainPhoto.secure_url,
      resume: uploadResults.resume.secure_url,
      projects: projects
    };

    // Here you would typically save finalData to your database
    // For this example, we'll just return it

    return NextResponse.json({
      message: 'Form data processed successfully',
      data: finalData
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

