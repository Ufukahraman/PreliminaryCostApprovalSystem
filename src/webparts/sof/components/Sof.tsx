import * as React from 'react';
import styles from './Sofi.module.scss';
import { ISofProps } from "./ISofProps";
import axios from 'axios';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { MYModal } from './MYModal';


interface IState {
  maliyetlistesi: any[];
  modalOpen: boolean;
  selectedRow: number | null; // Seçilen satırın indeksini saklamak için değişken eklendi
}

export default class Sof extends React.Component<ISofProps, IState> {
  aaa: () => void;
  constructor(props: ISofProps) {
    super(props);
    this.state = {
      maliyetlistesi: [],
      modalOpen: false,
      selectedRow: null // Başlangıçta herhangi bir satır seçilmemiş
    };
  }


  // Modal'ı açmak için kullanılan fonksiyon
  openModal = (index: number) => {
    this.setState({ modalOpen: true, selectedRow: index });
  };

  // Modal'ı kapatmak için kullanılan fonksiyon
  closeModal = () => {
    this.setState({ modalOpen: false, selectedRow: null });
  };

  private createItem = (urunKodu: any, onmaliyet: any): void => {

    const body: string = JSON.stringify({
      Title: urunKodu,
      Maliyet: onmaliyet


    });
    this.props.context.spHttpClient
      .post(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ret')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          console.log("Öğe başarıyla oluşturuldu.");
        } else {
          console.error("Öğe oluşturma işlemi başarısız oldu. Hata kodu: " + response.status);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  getData = (): void => {
    const listName = "ret"; // Listenizin adını buraya ekleyin
    const columns = [
      "Title",
      "Maliyet"
    ];

    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl
        }/_api/web/lists/getbytitle('${listName}')/items?$select=${columns.join(
          ","
        )}`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {

            const tumlist = responseJSON.value.map((item: any) => ({
              Title: item.Title,
              Maliyet: item.Maliyet
            }));
            // Filtreleme işlemi
            const filteredlist = this.state.maliyetlistesi.filter((item: any) => {
              return !tumlist.some((tumItem: any) => tumItem.Title === item.ModelKodu);
            });
            /*             const filteredlist2 = this.state.maliyetlistesi.filter((item: any) => {
                          return !tumlist.some((tumItem: any) => tumItem.Maliyet === item.onmaliyet);
                        }); */

            // Filtrelenmiş listeyi state'e atama işlemi
            this.setState({ maliyetlistesi: filteredlist });

          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(`Bir terslik var.`);
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };


  async componentDidMount() {
    await this.maliyetlerigetir();
    this.getData();
  }



  maliyetlerigetir = async (): Promise<void> => {
    try {
      const response = await axios.get('https://satinalmaformu.com/maliyet');
      if (response.status === 200) {
        this.setState({ maliyetlistesi: response.data });

      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  public render(): React.ReactElement<ISofProps> {

    return (
      <div>
        <MYModal handler={this.aaa}>
          <div className={styles.custom} id="Sof">
            <table className={styles.table}>
              <tr>

                <td>
                  <div style={{ overflowX: 'auto', maxHeight: '800px', height: '800px', }}>
                    <table className={styles.table} id="Tablo">
                      <thead>
                        <tr>
                          <th colSpan={9} className={styles.th}>
                            ÖN MALİYET ONAYI BEKLEYENLER
                          </th>
                        </tr>
                        <tr>
                          <td colSpan={9}>
                            <div className={styles.count}>
                              Toplamda {this.state.maliyetlistesi.length} kayıt Listeleniyor
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>Model Kodu</th>
                          <th>Model Adı</th>
                          <th>Üretim Sezonu</th>
                          <th>Yaş</th>
                          <th>Cinsiyet</th>
                          <th>Ön Maliyet</th>
                          <th>Görseller</th>
                          <th colSpan={2}> Onay</th>

                        </tr>
                      </thead>
                      <tbody>
                        {this.state.maliyetlistesi.map((kayit, index) => (
                          <tr key={index}>
                            <td>{kayit.ModelKodu}</td>
                            <td>{kayit.MdodelAdi}</td>
                            <td>{kayit.UretimSezon}</td>
                            <td>{kayit.Yas}</td>
                            <td>{kayit.Cinsiyet}</td>
                            <td>{kayit.onmaliyet}</td>
                            <td>
                              <button className={styles.customSubmitButton} onClick={() => this.openModal(index)}>Görüntüle</button>
                            </td>
                            {this.state.modalOpen && (
                              <MYModal handler={this.closeModal}>
                                {this.state.selectedRow !== null && (

                                  <div className={styles.resiModal}>
                                    <table className={styles.table}>
                                      <tr>
                                        <th>Model Kodu</th> 
                                        <th>Model Adı</th>
                                        <th>Üretim Sezonu</th>
                                        <th>Yaş</th>
                                        <th>Cinsiyet</th>
                                        <th>Ön Maliyet</th>
                                      </tr>
                                      <tr>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].ModelKodu}
                                        </td>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].MdodelAdi}
                                        </td>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].UretimSezon}
                                        </td>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].Yas}
                                        </td>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].Cinsiyet}
                                        </td>
                                        <td>
                                          {this.state.maliyetlistesi[this.state.selectedRow].onmaliyet}
                                        </td>
                                      </tr>
                                      <br></br>
                                      <tr>
                                        <td colSpan={3}>
                               
                                            <img
                                              width={500}
                                              height={500}
                                              src={this.state.maliyetlistesi[this.state.selectedRow].Photo}                
                                            />
                                    </td>
                                    <td colSpan={3}>
                                            <img
                                              width={500}
                                              height={500}
                                              src={this.state.maliyetlistesi[this.state.selectedRow].Photo2} 
                                            />
                   
                                        </td>
                                      </tr>

                                    </table>



                                  </div>
                                )}
                              </MYModal>
                            )}




                            <td>
                              <button className={styles.customAddButton} onClick={() => this.onaylaMaliyet(kayit.ModelKodu)}>Onayla</button>
                            </td>
                            <td>
                              <button className={styles.customDeleteButton} onClick={() => this.reddetMaliyet(kayit.ModelKodu, kayit.onmaliyet)}>Reddet</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>

                <td>
                  <div style={{ height: '800px', width: '940px' }}>
                    <iframe title="pb" width="940px" height="800px" src="https://app.powerbi.com/view?r=eyJrIjoYjNi1iMTQyLWMzMGMxYmUzM2IxOCIsImMiOjl9" ></iframe>
                  </div>
                </td>


              </tr>
            </table>



          </div>
        </MYModal>

      </div>
    );
  }



  onaylaMaliyet = (urunKodu: string) => {
    axios.put(`https://satinalmaformu.com/api/urunler/${urunKodu}/onayla`)
      .then(response => {
        console.log(response.data);

        const index = this.state.maliyetlistesi.findIndex(kayit => kayit.ModelKodu === urunKodu);
        // İndeks mevcutsa, ilgili satırı listeden kaldır
        if (index !== -1) {
          const yeniMaliyetListesi = [...this.state.maliyetlistesi];
          yeniMaliyetListesi.splice(index, 1); // İlgili satırı kaldır 
          this.setState({ maliyetlistesi: yeniMaliyetListesi });
          alert(` ${urunKodu} model koduna sahip kaydın ön maliyeti onaylandı `);
        } else {
          console.error(`Kayıt ${urunKodu} bulunamadı.`);
        }
      })
      .catch(error => {
        console.error(error);
        // Hata durumunda gerekli işlemler yapılabilir
      });
  };


  reddetMaliyet(UrunKodu: any, onmaliyet: any): void {
    const index = this.state.maliyetlistesi.findIndex(kayit => kayit.ModelKodu === UrunKodu);
    // İndeks mevcutsa, ilgili satırı listeden kaldır
    if (index !== -1) {
      const yeniMaliyetListesi = [...this.state.maliyetlistesi];
      yeniMaliyetListesi.splice(index, 1); // İlgili satırı kaldır 
      this.setState({ maliyetlistesi: yeniMaliyetListesi });

      this.createItem(UrunKodu, onmaliyet);


      alert(`${UrunKodu} model koduna sahip kaydın ön maliyeti reddedildi `);

    } else {
      console.error(`Kayıt ${UrunKodu} bulunamadı.`);
    }
  }



}
