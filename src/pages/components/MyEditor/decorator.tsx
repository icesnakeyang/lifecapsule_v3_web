import React from "react";
import { CompositeDecorator } from "draft-js";

// for link
function findLinkEntities(contentBlock: any, callback: any, contentState: any) {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} title={url} className="custom_link">
      {props.children}
    </a>
  );
};

// for CUSTOMbtn
function findCustomBtn(contentBlock: any, callback: any, contentState: any) {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "CUSTOM_BTN"
    );
  }, callback);
}

const CustomBtn = (props: any) => {
  return <div className="custom_btn">{props.children}</div>;
};

export const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
  {
    strategy: findCustomBtn,
    component: CustomBtn,
  },
]);
