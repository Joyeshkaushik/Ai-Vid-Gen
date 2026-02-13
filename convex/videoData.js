import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateVideoData=mutation({
    args:{
        title:v.string(),
        topic:v.string(),
        script:v.string(),
        videoStyle:v.string(),
        voice:v.string(),
        captions:v.any(),
        uid:v.id("users"),
        createdBy:v.string(),
        credits:v.number()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.insert('videoData',{
            title:args.title,
            topic:args.topic,
            script:args.script,
            captions:args.captions,
            videoStyle:args.videoStyle,
            voice:args.voice,
            uid:args.uid,
            createdBy:args.createdBy,
            status:'pending'
        })

        await ctx.db.patch(args.uid,{
            credits:(args?.credits)-1
        })
        return result;
    }
})

export const UpdateVideoRecord=mutation({
    args:{
        recordId:v.id('videoData'),
        audioUrl:v.optional(v.string()),
        images:v.optional(v.string()),
        captionJson:v.optional(v.string()),
        videoUrl:v.optional(v.string())
    },
    handler:async(ctx,args)=>{
        const updates = {
            status:'completed'
        };
        
        if (args.audioUrl !== undefined) updates.audioUrl = args.audioUrl;
        if (args.captionJson !== undefined) updates.captionJson = args.captionJson;
        if (args.videoUrl !== undefined) updates.videoUrl = args.videoUrl;
        
        // ✅ FIXED: Only update images if explicitly provided
        // Don't add placeholders - leave existing images untouched
        if (args.images !== undefined && args.images !== null && args.images !== "" && args.images !== "[]") {
            updates.images = args.images;
            console.log("✅ Updating with generated images");
        }
        // ❌ REMOVED: Don't add placeholders automatically
        // If images aren't provided, the existing images in DB stay intact

        const result = await ctx.db.patch(args.recordId, updates);
        return result;
    }
})

export const GetUserVideos=query({
    args:{
        uid:v.id('users')
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('videoData')
            .filter((q)=>q.eq(q.field('uid'),args.uid))
            .order('desc')
            .collect();

        return result;
    }
})

export const GetVideoById = query({
    args: { videoId: v.string() },
    handler: async (ctx, args) => {
        const video = await ctx.db
            .query("videoData")
            .filter((q) => q.eq(q.field("_id"), args.videoId))
            .first();

        if (!video) return null;

        return {
            ...video,
            images: video.images || "[]",
            captionJson: video.captionJson || "[]",
            audioUrl: video.audioUrl || "",
        };
    },
});