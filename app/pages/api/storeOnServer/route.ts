import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection URI and database name
const uri: any = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let client: any;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

// Helper function to generate a unique ID (if needed, but MongoDB uses ObjectId by default)
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}


// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all domains or specify the allowed origin
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
};

export async function GET(request: any) {
  try {
    // Get the randomId from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const randomId = searchParams.get('randomId');

    // Connect to the database
    const db = await connectToDatabase();


    // If randomId is provided, search for that specific user
    // Otherwise, return all users
    let users;
    if (randomId) {
      users = await db.collection('users').find({ randomId: randomId }).toArray();
      
      // If no user found with the given randomId, return a 404 error
      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "No randomId found in query parameters"},{ status: 500})
     // users = await db.collection('users').find({}).toArray();
    }

    // Return the users data
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// POST a new user
export async function POST(request: any) {
  try {
    const userData = await request.json();

    if (!userData.name || !userData.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const newUser = {
      name: userData.name,
      email: userData.email,
      profession: userData.profession,
      bio: userData.bio,
      aboutMe: userData.aboutMe,
      photo: userData.photo,
      resume: userData.resume,
      projects: userData.projects || [],
      skills: userData.skills || [],
      socialLinks: userData.socialLinks || {},
      intiatingUser: userData.intiatingUser,
      randomId: userData.randomId,
    };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User created successfully', user: result });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) a user
export async function PUT(request: any) {
  try {
    const userData = await request.json();

    if (!userData.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const updatedUser = {
      $set: {
        name: userData.name,
        email: userData.email,
        profession: userData.profession,
        bio: userData.bio,
        aboutMe: userData.aboutMe,
        photo: userData.photo,
        resume: userData.resume,
        projects: userData.projects || [],
        skills: userData.skills || [],
        socialLinks: userData.socialLinks || {},
        intiatingUser: userData.intiatingUser,
      },
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userData.id) },
      updatedUser
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request: any) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
