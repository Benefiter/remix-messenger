
export const getFormDataItemsFromRequest = async (request: Request, items: string[]) => {
    const formData = await request.formData();

    console.log('getFormDataItemsFromRequest')
    console.log(formData)
  
    if (formData == null) throw new Error(`No session formData exists on session to get requested item ${[...items]}`)

    interface ObjectLiteral {
        [key: string]: any;
      }

    const itemValuesObject: ObjectLiteral = {};
    items.forEach((i: string) => {
        itemValuesObject[i] = formData.get(i)
    })

    return itemValuesObject
}