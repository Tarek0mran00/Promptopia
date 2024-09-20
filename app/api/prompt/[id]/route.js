import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request,{params}) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate('creator')

        if(!prompt) return new Response("Prompt not found",{ status : 404})
            return new Response(JSON.stringify(prompt), { status: 200 })

        
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 


export const PATCH = async (request,{params})=> {
    const {prompt,tag} = await request.json();

    try{
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id);


        if(!existingPrompt) return new Response("Prompt not found",{ status : 404})

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 })






    }catch(error) {
        return new Response("Failed to update the prompt", { status: 500 })

    }
}

export const POST = async (request) => {
    const { userId, prompt, tag } = await request.json();

    try {
        await connectToDB();
        const newPrompt = new Prompt({ creator: userId, prompt, tag });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}

// Delete a specific prompt
export const DELETE = async (request, { params }) => {
    try {
      await connectToDB();
  
      const promptId = params.id;
  
    
  
      // Use findByIdAndDelete instead of findByIdAndRemove
      await Prompt.findByIdAndDelete(promptId);
  
      
  
      return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Error deleting prompt:", error); // Log the error
      return new Response("Failed to delete the prompt", { status: 500 });
    }
  };