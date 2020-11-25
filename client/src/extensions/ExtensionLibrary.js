// This code is written by Samuel Ratford in its entirety
// This is a library that is used by developers. The functions are explained in the report.

export const React = require("react")

export function socketSendState(props, data) {
    props.webSocket.emit("extensionEmit", { data, name: props.name, roomID: props.roomID });
}

export function socketGetState(props, userFunction) {
    props.webSocket.on("extensionEmit", (data) => {
        if (data.name === props.name) {
            userFunction(data.data);
        }
    })
}

export function socketSendToID(props, data, id) {
    props.webSocket.emit("extensionEmitToID", { data: data.data, name: props.name, id });
}

export function socketGetToID(props, userFunction) {
    props.webSocket.on("extensionEmitToID", (data) => {
        if (data.name === props.name) {
            userFunction(data.data);
        }
    })
}

export function socketSendVolatile(props, data) {
    props.webSocket.emit("extensionEmitVolatile", { data, name: props.name, roomID: props.roomID });
}

export function socketGetVolatile(props, userFunction) {
    props.webSocket.on("extensionEmitVolatile", (data) => {
        if (data.name === props.name) {
            userFunction(data.data);
        }
    })
}

export function socketSendToSelf(props, data) {
    props.webSocket.emit("socketSendToSelf", { data, name: props.name });
}

export function socketGetFromSelf(props, userFunction) {
    props.webSocket.on("socketSendToSelf", (data) => {
        if (data.name === props.name) {
            userFunction(data.data);
        }
    })
}