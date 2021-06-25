<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Backend\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\BrandRequest;
use App\Traits\ImageTrait;

class BrandController extends Controller
{
    use ImageTrait;

    public function index()
    {
        $brands =  Brand::all();
        return response()->json($brands);
    }

    public function store(BrandRequest $request)
    {
        // Brand::create($request->validated());
        $brand = new Brand();
        $brand->fill($request->except('_method', '_token', 'image'));
        $this->storeImage($request, $brand, 'image', 'brand');
        $brand->save();

        return response()->json('Created Successfully', 201);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        $brand->fill($request->except('_method', '_token', 'image'));
        $this->storeImage($request, $brand, 'image', 'brand');
        $brand->update();

        return response()->json('Updated Successfully', 202);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return response()->json('Deleted Successfully', 204);
    }
}
