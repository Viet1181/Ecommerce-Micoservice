import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput } from "react-admin";

export const CategoryList = () => (
    <List>
    <Datagrid>
        <TextField source="id" label="Category ID" />
        <TextField source="name" label="Category Name" />
        <EditButton />
        <DeleteButton />
    </Datagrid>
</List>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="categoryName" label="Category Name" />
        </SimpleForm>
    </Create>
);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="categoryId" label="Category ID" disabled />
            <TextInput source="categoryName" label="Category Name" />
        </SimpleForm>
    </Edit>
);