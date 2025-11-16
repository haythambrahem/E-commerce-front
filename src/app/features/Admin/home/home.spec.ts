import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Import pour simuler les appels HTTP


describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        HttpClientTestingModule // ✅ Ajout ici
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
