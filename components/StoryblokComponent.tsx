import React, { forwardRef } from "react";
import { ComponentsMap } from "./components-list";
import { SbBlokData } from "@storyblok/js";

interface StoryblokComponentProps {
    blok: SbBlokData;
    [key: string]: unknown;
}

export const StoryblokComponent = forwardRef<HTMLElement, StoryblokComponentProps>(
    ({ blok, ...restProps }, ref) => {
        if (!blok) {
            console.error(
                "Please provide a 'blok' property to the StoryblokComponent"
            );
            return (
                <div>Please provide a blok property to the StoryblokComponent</div>
            );
        }
        const Component = getComponent(blok.component);
        if (Component) {
            return <Component ref={ref} blok={blok} {...restProps} />;
        }
        return <></>;
    }
);

const getComponent = (componentKey: string) => {
    if (!ComponentsMap[componentKey]) {
        console.error(`Component ${componentKey} doesn't exist.`);
        return false;
    }

    return ComponentsMap[componentKey];
};
