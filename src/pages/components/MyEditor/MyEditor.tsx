import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveEditing, saveRichContent } from "../../../store/commonSlice";
import { stateToHTML } from "draft-js-export-html";
import {
  saveDetail1,
  saveDetail2,
  saveDetail3,
} from "../../../store/creativeNoteSlice";

const MyEditor = (data: any) => {
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

  const editingRedux = useSelector((state: any) => state.commonSlice.editing);
  const richContent =
    useSelector((state: any) => state.commonSlice.richContent) || "";
  const [oldContent, setOldContent] = useState("");
  const detail1 = useSelector((state: any) => state.creativeNoteSlice.detail1);
  const detail2 = useSelector((state: any) => state.creativeNoteSlice.detail2);
  const detail3 = useSelector((state: any) => state.creativeNoteSlice.detail3);
  const [editorState, setEditorState] = useState(formatEditorState(""));

  /**
   * 要修改的内容从父组件传入，在data里取出，然后初始化给editorState
   * 原始内容和每次用户修改后，会保存在redux的richContent里，用来检测用户是否修改了富文本。
   * （因为每次用户鼠标点击富文本框，都会触发onChange方法，而实际上内容并未被修改，这给判断用户是否修改了内容带来了许多麻烦）
   */

  useEffect(() => {
    if (data.type === "NORMAL") {
      setEditorState(formatEditorState(richContent));
    } else {
      if (data.type === "CREATIVE_NOTE1") {
        if (detail1) {
          setEditorState(formatEditorState(detail1));
        }
      } else {
        if (data.type === "CREATIVE_NOTE2") {
          if (detail2) {
            setEditorState(formatEditorState(detail2));
          }
        } else {
          if (data.type === "CREATIVE_NOTE3") {
            if (detail3) {
              setEditorState(formatEditorState(detail3));
            }
          }
        }
      }
    }

    return () => {};
  }, []);

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={(e: any) => {
          const dd = stateToHTML(e.getCurrentContent());
          setEditorState(e);
          if (data.type === "NORMAL") {
            dispatch(saveRichContent(dd));
            setOldContent(richContent);
            if (richContent !== oldContent) {
              dispatch(saveEditing(editingRedux + 1));
            }
          } else {
            if (data.type === "CREATIVE_NOTE1") {
              dispatch(saveDetail1(dd));
            } else {
              if (data.type === "CREATIVE_NOTE2") {
                dispatch(saveDetail2(dd));
              } else {
                if (data.type === "CREATIVE_NOTE3") {
                  dispatch(saveDetail3(dd));
                }
              }
            }
          }
        }}
        onBlur={() => {}}
      />
    </div>
  );
};
export default MyEditor;
