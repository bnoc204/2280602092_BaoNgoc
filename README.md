# Categories API Sample

Simple Express API implementing category CRUD and a route to return products for a given category.

Endpoints:

- `GET /api/v1/categories?name=...` - list categories, optional `name` query (partial, case-insensitive)
- `GET /api/v1/categories/:id` - get category by id
- `GET /api/v1/categories/slug/:slug` - get category by slug
- `POST /api/v1/categories` - create category (body: `name`, `slug`, `image`)
- `PUT /api/v1/categories/:id` - edit category
- `DELETE /api/v1/categories/:id` - delete category
- `GET /api/v1/categories/:id/products` - return all products with `categoryId` = `id`

Run:

```powershell
cd c:\HOC_CODE\NNPTUD-C6
npm install
npm start
```
# NNPTUD-C6