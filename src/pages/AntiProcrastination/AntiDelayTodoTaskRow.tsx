import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Checkbox} from "antd";
import {saveAntiDelayTodoListEdit, saveAntiDelayTodoListNew} from "../../store/antiDelaySlice";
import {CloseOutlined} from "@ant-design/icons";

const AntiDelayTodoTaskRow = (data: any) => {
    const {item, method} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const antiDelayTodoListEdit = useSelector(
        (state: any) => state.antiDelaySlice.antiDelayTodoListEdit,
    );
    const antiDelayTodoListNew = useSelector(
        (state: any) => state.antiDelaySlice.antiDelayTodoListNew,
    );
    const dispatch = useDispatch()

    const onCompleteTodoTask = (row: any) => {
        let list: any = [];
        if (method && method === 'edit') {
            antiDelayTodoListEdit.map((reduxRow: any) => {
                if (reduxRow.taskTitle === row.taskTitle) {
                    let row1 = {
                        taskTitle: row.taskTitle,
                        complete: !reduxRow.complete,
                    };
                    list.push(row1);
                } else {
                    list.push(reduxRow);
                }
            });
            dispatch(saveAntiDelayTodoListEdit(list));
        } else {
            antiDelayTodoListNew.map((reduxRow: any) => {
                if (reduxRow.taskTitle === row.taskTitle) {
                    let row1 = {
                        taskTitle: row.taskTitle,
                        complete: !reduxRow.complete,
                    };
                    list.push(row1);
                } else {
                    list.push(reduxRow);
                }
            });
            dispatch(saveAntiDelayTodoListNew(list));
        }
    };

    const onRemoveTask = (item1: any) => {
        let list: any = [];
        if (method && method === 'edit') {
            antiDelayTodoListEdit.map((reduxRow: any) => {
                if (item1.taskTitle === reduxRow.taskTitle) {
                } else {
                    list.push(reduxRow);
                }
            });
            dispatch(saveAntiDelayTodoListEdit(list));
        } else {
            antiDelayTodoListNew.map((reduxRow: any) => {
                if (item1.taskTitle === reduxRow.taskTitle) {
                } else {
                    list.push(reduxRow);
                }
            });
            dispatch(saveAntiDelayTodoListNew(list));
        }
    };

    return (
        <div style={{marginTop: 10, background: themeColor.blockDark}}>
            {item.complete ?
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Checkbox checked={item.complete} onChange={() => {
                        onCompleteTodoTask(item)
                    }}></Checkbox>
                    <div style={{
                        marginLeft: 10,
                        color: themeColor.textHolder,
                        textDecorationLine: 'line-through'
                    }}>{item.taskTitle}</div>
                    <Button style={{background: themeColor.blockDark, borderWidth: 0}} onClick={() => {
                        onRemoveTask(item);
                    }} icon={<CloseOutlined
                        style={{color: themeColor.colorDanger}}/>}></Button>
                </div>
                :
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Checkbox checked={item.complete} onChange={() => {
                        onCompleteTodoTask(item)
                    }}></Checkbox>
                    <div style={{marginLeft: 10, color: themeColor.textLight}}>{item.taskTitle}</div>
                    <Button style={{background: themeColor.blockDark, borderWidth: 0}} onClick={() => {
                        onRemoveTask(item);
                    }} icon={<CloseOutlined
                        style={{color: themeColor.colorDanger}}/>}></Button>
                </div>}
        </div>
    )
}
export default AntiDelayTodoTaskRow
