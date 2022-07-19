import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveEditing, saveRichContent } from "../store/commonSlice";
import { stateToHTML } from "draft-js-export-html";

const MyEditor = (data: any) => {
  const html = data.data;
  const formatEditorState = (text: string) => {
    const blocksFromHTML = convertFromHTML(text);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    const dd = EditorState.createWithContent(contentState);

    return dd;
  };

  const dispatch = useDispatch();

  const [editorState, setEditorState] = useState(formatEditorState(html));
  const editingRedux = useSelector((state: any) => state.commonSlice.editing);
  const richContent = useSelector(
    (state: any) => state.commonSlice.richContent
  );

  const [oldContent, setOldContent] = useState("");

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={(e: any) => {
          const dd = stateToHTML(e.getCurrentContent());
          setEditorState(e);
          dispatch(saveRichContent(dd));
        }}
        onBlur={() => {
          setOldContent(richContent);
          if (richContent !== oldContent) {
            dispatch(saveEditing(editingRedux + 1));
          }
        }}
      />
    </div>
  );
};
export default MyEditor;
