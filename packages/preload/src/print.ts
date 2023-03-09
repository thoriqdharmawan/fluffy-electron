import { /* Image, */ Printer } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";

// import imgSrc from './tux.png?url'

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export function convertToRupiah(nominal: number) {
  return idrFormatter.format(nominal);
}

interface ProductsSales {
  name: string,
  qty: number,
  price: number
}

interface DataTransaction {
  merchant_name: string,
  location: string
  date: string,
  total_amount: number,
  total_payment: number,
  products_sales: ProductsSales[]
}


export async function print(data_transaction: DataTransaction) {
  const device = new USB();
  await new Promise<void>((resolve, reject) => {
    device.open(async function (err) {
      if (err) {
        reject(err);
        return
      }

      let printer = new Printer(device, { width: 58 });

      const divider = () => {
        printer
          .font("a")
          .align("ct")
          .style("bu")
          .size(1, 1)
          .text("")
          .text("================================")
          .text("")
      }

      const header = (name: string, address: string, date: string) => {
        printer
          .font("a")
          .align("ct")
          .style("bu")
          .size(1, 1)
          .marginBottom(5)
          .text(name)
          .text(address)
          .text(date)
          .text("================================")
          .text("")
      }

      const products = (name: string, qty: number, price: number) => {
        printer
          .font("a")
          .align("lt")
          .style("bu")
          .size(1, 1)
          .text(name)
          .text(`${qty} @${convertToRupiah(price)}`)
        printer
          .font("a")
          .align("RT")
          .style("bu")
          .size(1, 1)
          .text(`${convertToRupiah(price * qty)}`)
      }

      const summary = (label: string, value: number = 0) => {
        printer
          .font("a")
          .align("lt")
          .style("B")
          .size(1, 1)
          .text(`${label}: `)
        printer
          .font("a")
          .align("RT")
          .style("B")
          .size(1, 1)
          .text(`${convertToRupiah(value)}`)
      }

      const footer = (label: string = "Terima Kasih Telah Berbelanja") => {
        printer
          .font("a")
          .align("lt")
          .style("bu")
          .size(1, 1)
          .text(label)
      }

      // const image = await Image.load(imgSrc);

      const { merchant_name, location, date, products_sales, total_amount, total_payment } = data_transaction
      const offset = total_payment - (total_amount || 0)

      header(merchant_name, location, date)

      products_sales.forEach((p) => {
        products(p.name, p.qty, p.price)
      })

      divider()
      summary("Total Tagihan", total_amount)
      summary("Dibayar", total_payment)
      summary(offset > 0 ? "Kembali" : "Kurang", offset)
      divider()
      footer()

      printer
        .cut()
        .close()
        .finally(resolve)
    });
  });
}

export async function printTest() {
  const device = new USB();
  await new Promise<void>((resolve, reject) => {
    device.open(async function (err) {
      if (err) {
        reject(err);
        return
      }

      let printer = new Printer(device, { width: 58 });

      printer
        .font("a")
        .align("lt")
        .style("bu")
        .size(1, 1)
        .text("Printer Berjalan Dengan Baik")
      printer
        .cut()
        .close()
        .finally(resolve)
    });
  });
}