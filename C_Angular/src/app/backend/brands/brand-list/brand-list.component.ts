import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Brand } from '../../_models/brand';
import { BrandService } from '../../_services/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
})
export class BrandListComponent implements OnInit {
  //
  isLoading: boolean = true;
  searchText: string = '';

  // Pagination
  page: number = 1;
  collectionSize: number = 0;
  pageSize: number = 8;

  //
  brands!: Brand[];
  filteredBrands!: Brand[];
  brandForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    image: [''],
    description: ['', Validators.required],
  });

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private titleService: Title,
    private brandService: BrandService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Brand List');
    this.getBrands();
  }

  getBrands(): void {
    this.isLoading = true;
    this.brandService
      .getAll()
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.brands = response;
          this.filteredBrands = this.brands.filter((brand: Brand) => {
            return brand.name
              .toLowerCase()
              .includes(this.searchText.toLowerCase());
          });
          this.collectionSize = this.brands.length;
        },
        (error: any) => {
          this.toastr.error('Failed to get data', error);
        }
      )
      .add(() => (this.isLoading = false));
  }

  onChangeSearch(): void {
    this.filteredBrands = this.brands.filter((brand: Brand) => {
      return brand.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.brandForm.get('image')?.setValue(file);
    }
    console.log(this.brandForm.value);
  }

  onCreateSubmit(): void {
    const formData = new FormData();
    formData.append('file', this.brandForm.get('image')?.value);
    console.log(formData);

    this.isLoading = true;
    this.brandService
      .create(this.brandForm.value)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.getBrands();
          this.toastr.success(response, 'Created successfully!');
          this.brandForm.reset();
        },
        (error: any) => {
          this.toastr.error(error, 'Failed to create!');
        }
      )
      .add(() => (this.isLoading = false));
  }

  onUpdateSubmit(brand: Brand): void {
    this.isLoading = true;
    this.brandService
      .update(brand.id, this.brandForm.value)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.searchText = '';
          this.modalService.dismissAll('Dismissed after saving data');
          this.getBrands();
          this.toastr.success('Updated successfully!', response);
          this.brandForm.reset();
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to update!', error);
        }
      )
      .add(() => (this.isLoading = false));
  }

  onDelete(brand: Brand): void {
    this.isLoading = true;
    brand.isDeleting = true;

    this.brandService
      .delete(brand.id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.searchText = '';
          this.getBrands();
          this.toastr.success(response, 'Deleted successfully!');
        },
        (error: any) => {
          this.toastr.error(error, 'Failed to delete!');
        }
      )
      .add(() => (this.isLoading = false));
  }

  triggerModal(content: any, brand?: Brand, action?: string) {
    if (action === 'update') {
      this.brandForm = this.fb.group({
        name: [brand?.name, Validators.required],
        description: [brand?.description, Validators.required],
      });
    }

    const size = action === 'delete' ? 'sm' : '500';

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        size: size,
      })
      .result.then(
        () => {
          switch (action) {
            case 'create':
              this.onCreateSubmit();
              break;
            case 'update':
              if (brand) this.onUpdateSubmit(brand);
              break;
            case 'delete':
              if (brand) this.onDelete(brand);
          }
        },
        () => {}
      );
  }
}
