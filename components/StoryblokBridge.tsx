'use client'
import { loadStoryblokBridge, SbBlokData } from '@storyblok/js'
import { StoryblokComponent } from "./StoryblokComponent";
import { useState } from "react";

const StoryblokBridge = ( { blok } : {blok: SbBlokData}) => {
    const [blokState, setBlokState] = useState(blok);
    loadStoryblokBridge().then( () => {
        const { StoryblokBridge, location } = window;
        const storyblokInstance = new StoryblokBridge();
        storyblokInstance.on( [ 'published', 'change' ], () => {
            location.reload()
        } )
        storyblokInstance.on( [ 'input' ], ( e ) => {
            setBlokState(e?.story?.content);
        } )
    } ).catch( ( err ) => console.error( err ) )
    return <StoryblokComponent blok={ blokState }/>
}

export default StoryblokBridge
