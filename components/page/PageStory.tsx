import { StoryblokComponent } from "../StoryblokComponent";



const PageStory = ({blok}) => {
    return (<main >
            {blok.body.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid}/>
            ))}
        </main>
    )
};

export default PageStory;
