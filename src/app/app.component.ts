import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from './services/currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private currencyService = inject(CurrencyService);


  fromCurrency = 'USD';
  toCurrency = 'EUR';
  amount = 1;
  convertedAmount: number | null = null;
  currencies: string[] = [];
  rates: Record<string, number> = {};


  isLoading = false;
  errorMessage: string | null = null;
  lastUpdated: Date | null = null;
  displayResult = false;

 
  currencyFlags: Record<string, string> = {
    'USD': 'US', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP', 'INR': 'IN',
    'AUD': 'AU', 'CAD': 'CA', 'CHF': 'CH', 'CNY': 'CN', 'SEK': 'SE',
    'NZD': 'NZ', 'KRW': 'KR', 'SGD': 'SG', 'HKD': 'HK', 'NOK': 'NO',
    'MXN': 'MX', 'BRL': 'BR', 'RUB': 'RU', 'ZAR': 'ZA'
  };

  ngOnInit(): void {
    this.loadRates();
  }

  get singleUnitRate(): string | null {
    if (!this.rates[this.toCurrency]) {
      return null;
    }
    const rate = this.rates[this.toCurrency];
    return `1 ${this.fromCurrency} = ${rate.toFixed(4)} ${this.toCurrency}`;
  }

  loadRates(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.displayResult = false;
    this.convertedAmount = null;

    this.currencyService.getRates(this.fromCurrency).subscribe({
      next: (data) => {
        this.rates = data.rates;
        this.currencies = [...new Set(['USD', 'EUR', 'GBP', 'JPY', 'INR', ...Object.keys(this.rates)])].sort();
        this.lastUpdated = new Date();
        this.isLoading = false;
        this.convert();
      },
      error: (err) => {
        this.errorMessage = "Sorry, we couldn't fetch exchange rates. Please try again later.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  convert(): void {
    if (this.amount >= 0 && this.rates[this.toCurrency]) {
      const rate = this.rates[this.toCurrency];
      this.convertedAmount = this.amount * rate;
      this.triggerAnimation();
    } else {
      this.convertedAmount = 0;
    }
  }

  swapCurrencies(): void {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.loadRates();
  }

  triggerAnimation(): void {
    this.displayResult = false;
    setTimeout(() => {
      this.displayResult = true;
    });
  }
}
