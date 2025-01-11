import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

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
    console.log(data);

    const rawPhoto = data.get('photo') as File;
    const rawResume = data.get('resume') as File;

    // Check if photo and resume exist in the form data
    if (!rawPhoto || !rawResume) {
      console.error('Missing photo or resume:', rawPhoto, rawResume);
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    // Upload photo and resume directly to Cloudinary
    const uploadResults = {
      mainPhoto: await uploadToCloudinary(rawPhoto),
      resume: await uploadToCloudinary(rawResume),
      projects: []
    };

    // Process project files
    const projects = [];
    let index = 0;

    while (data.has(`project_${index}`)) {
      const rawProjectFile = data.get(`project_${index}`) as File;
      if (rawProjectFile) {
        const uploadedProjectPhoto = await uploadToCloudinary(rawProjectFile);
        projects.push({
          photo: uploadedProjectPhoto.secure_url,
          public_id: uploadedProjectPhoto.public_id,
          metadata: JSON.parse(data.get(`project_metadata_${index}`) as string || '{}')
        });
      }
      index++;
    }

    // Process other non-file form data
    const processedData = {};
    for (const [key, value] of data.entries()) {
      if (!['photo', 'resume'].includes(key) && !key.startsWith('project_')) {
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

    return NextResponse.json({
      message: 'Form data processed successfully',
      data: finalData
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed', details: error }, { status: 500 });
  }
}
