<?php

namespace App\Http\Controllers\Backend;

use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use App\Models\Backend\Product;
use Illuminate\Routing\Controller;

use App\Models\Backend\Brand;
use App\Models\Backend\Category;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
        foreach($products as $product){
            $product->category_name = $product->category->name;
            $product->brand_name = $product->brand->name;
        }
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Product::create($request->all());
        $product = new Product();
        $product->fill($request->all());
        if ($request->hasFile('image')) {
            $image_name = $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('public/products', $image_name);
            $product->image = Storage::url($path);
        }
        $product->save();
        return response()->json('create successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Backend\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Backend\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        // return response()->json($request);
        $data_update = [
            'name' => $request->name,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'description' => $request->description,
        ];
        if ($request->hasFile('image')) {
            $image_name = $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('public/products', $image_name);
            $data_update['image'] = Storage::url($path);
        }

        $product->update($data_update);

        return response()->json('update successfully', 202);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Backend\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json('successfully', 204);
    }
}
