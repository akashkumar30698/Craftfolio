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


function convertToFile(photoName: string): File {


  // Extract the file extension
  const fileExtension = photoName.split('.').pop()?.toLowerCase();

  // Determine the MIME type based on the file extension
  let mimeType: string;
  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'pdf':
      mimeType = 'application/pdf';
      break;
    default:
      throw new Error('Unsupported file type');
  }

  // Create a Blob with the MIME type (replace with actual file data if needed)
  const photoBlob = new Blob([photoName], { type: mimeType });

  // Use the File constructor to create the File object
  const file = new File([photoBlob], photoName, { type: mimeType });

  return file;
}


// Function to convert the photos in an array to File objects
async function convertPhotosToFiles(data: { id: string; title: string; description: string; photo: string }[]): Promise<{ id: string; title: string; description: string; photo: File }[]> {
  const convertedData = await Promise.all(data.map(async (item) => {
    const file = await convertToFile(item.photo);
    return {
      ...item,
      photo: file,
    };
  }));

  return convertedData;
}




export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();


    

    // Process files
    const rawPhoto = data.get('photo') as string
    const rawResume = data.get('resume') as string
    const photo = convertToFile(rawPhoto)
    const resume = convertToFile(rawResume)



    if (!photo || !resume) {
      console.error('Missing photo or resume:', photo, resume);
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    const uploadResults = {
      mainPhoto: await uploadToCloudinary(photo),
      resume: await uploadToCloudinary(resume),
      projects: []
    };

    // Process project files
    const projects = [];
    let index = 0;

    while (data.has(`project_${index}`)) {
      const rawProjectFile = data.get(`project_${index}`) 


      if(typeof rawProjectFile == 'string'){
        const parsedProjectFile  = JSON.parse(rawProjectFile) ;
        const projectFile = convertToFile(parsedProjectFile.photo)

        if (projectFile) {
          const uploadedProjectPhoto = await uploadToCloudinary(projectFile);
          projects.push({
            photo: uploadedProjectPhoto.secure_url,
            public_id: uploadedProjectPhoto.public_id,
            metadata: JSON.parse(data.get(`project_metadata_${index}`) as string || '{}')
          });
        }
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

    // Return processed data
    return NextResponse.json({
      message: 'Form data processed successfully',
      data: finalData
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed', details: error }, { status: 500 });
  }
}
