// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.

// BEGIN EXTRA CODE

function toDataUrl(url: string): Promise<string> {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    });
}
// END EXTRA CODE

/**
 * @param {MxObject} imageDocument
 * @returns {Promise.<string>}
 */
export async function ImageToBase64String(imageDocument: mendix.lib.MxObject): Promise<string> {
    // BEGIN USER CODE
    // TODO make it Native, implement error cases

    const url = mx.data.getDocumentUrl(imageDocument.getGuid(), imageDocument.get("changeDate") as number);
    return toDataUrl(url);
    // END USER CODE
}