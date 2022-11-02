import {storyblokEditable, StoryblokComponent} from "@storyblok/react";
import {FunctionComponent} from "react";
import {BlokComponentModel} from "../../models/blok-component.model";
import {SbBlokData} from "@storyblok/js";

interface PageStoryProps extends SbBlokData {
    body: SbBlokData[];
}

const PageStory: FunctionComponent<BlokComponentModel<PageStoryProps>> = (props) => {
    const {blok} = props;
    return (<main {...storyblokEditable(blok)}>
            {blok.body.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid}/>
            ))}
        </main>
    )
};

export default PageStory;
