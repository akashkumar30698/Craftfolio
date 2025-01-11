import { NextResponse } from 'next/server';

export async function GET(request) {
    try{
        const { tokenName } = await request.json();
        if(!tokenName){
            return NextResponse.json({ error: "Token name not found" },{status: 404});
        }
        const authToken = request.cookies.get(tokenName);
        return NextResponse.json({ data: authToken });
    }catch(err){
        console.log("Some error occured ",err)
        return NextResponse.json({ error: "Some error occured"},{status: 500});
    }
}
