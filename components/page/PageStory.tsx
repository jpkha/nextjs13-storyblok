import { StoryblokComponent } from "../StoryblokComponent";
import { storyblokEditable } from "@storyblok/js";

const PageStory = ( { blok } ) => {

    return ( <main {...storyblokEditable(blok)}>
            { blok.body.map( ( nestedBlok ) => (
                <StoryblokComponent blok={ nestedBlok } key={ nestedBlok._uid }/>
            ) ) }
        </main>
    )
};

export default PageStory;
