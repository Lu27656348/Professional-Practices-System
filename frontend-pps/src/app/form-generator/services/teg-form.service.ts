import { Injectable } from '@angular/core';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

async function getImageAsDataURL(imagePath: string): Promise<string> {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

@Injectable({
  providedIn: 'root'
})
export class TegFormService {

  constructor() { }

  imageDataURL = getImageAsDataURL('../../../assets/Goldo.PNG');

  generateDocx(data: any) : Observable<any> {
    const doc = new docx.Document({
      creator: "Luis C. Somoza & Wladimir SanVicente",
      title: "Planilla de propuesta de TEG",
      description: "Planilla de propuesta de TEG",
      styles: {
        default: {
            heading1: {
                run: {
                    size: 23,
                    bold: true,
                },
                paragraph: {
                    spacing: {
                        after: 200,
                    },
                    alignment: docx.AlignmentType.CENTER,
                },
            },
        },
        paragraphStyles: [
            {
                id: "aside",
                name: "Aside",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    size: 22,
                },
                paragraph: {
                    spacing: {
                        line: 200,
                    },
                },
            }
        ]
      },
      sections: [{
        headers: {
          default: new docx.Header({
            children: [
              new docx.Paragraph({
                children: [  
                    
                ],
                alignment: docx.AlignmentType.LEFT
            })
            ]
          }),
        },
        footers: {
          default: new docx.Footer({
            children: [
              new docx.Paragraph({
                children: [
                    /*
                    new ImageRun({
                        data: readFileSync('Untitled.png'),
                        transformation: {
                            width: 600,
                            height: 15,
                        },
                        alignment: AlignmentType.CENTER
                    }),
                    */
                ],
                alignment: docx.AlignmentType.CENTER
              }),
              new docx.Paragraph({
                  children: [
                      new docx.TextRun({
                          text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                      })
                  ],
                  alignment: docx.AlignmentType.CENTER
              }),
              new docx.Paragraph({
                  children: [
                      new docx.TextRun({
                          text: "Avenida Atlántico, Ciudad Guayana 8050",
                      })
                  ],
                  alignment: docx.AlignmentType.CENTER
              }),
              new docx.Paragraph({
                  children: [
                      new docx.TextRun({
                          text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                      })
                  ],
                  alignment: docx.AlignmentType.CENTER
              }),
              new docx.Paragraph({
                  children: [
                      new docx.TextRun({
                          text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                      })
                  ],
                  alignment: docx.AlignmentType.CENTER
              })
            ]
          }),
        },
        children: [
          new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Ciudad Guayana, ' + data.fecha_envio.toLocaleDateString(),
                    font: "Times New Roman",
                })
            ],
            alignment: docx.AlignmentType.RIGHT,
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            },
        }),
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Señores',
                    font: "Times New Roman",
                }),
            ],
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),    
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Consejo de Escuela de Ingenieria Informatica',
                    font: "Times New Roman",
                }),
            ],
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Facultad de Ingenieria',
                    font: "Times New Roman",
                }),
            ],
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Universidad Catolica Andres Bello',
                    font: "Times New Roman",
                }),
            ],
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: 'Presente. -',
                    font: "Times New Roman",
                }),
            ],
            spacing: {
                after: 200,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),
        new docx.Paragraph({
            style: "aside",
            children: [
                new docx.TextRun({
                    text: "Por medio de la presente hago constar que estoy dispuesto a supervisar, en calidad de Tutor Académico el Trabajo Experimental de Grado (TEG) titulado: " + '"'+data.titulo+'", que será desarrollado por el (los) alumno(s):',
                    font: "Times New Roman",
                })
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            indent: {
                firstLine: 400
            },
            spacing: {
                after: 100,
                line: 355,
                lineRule: docx.LineRuleType.AUTO,
            }
        }),


        ] // Add the missing children property
      }]
    });

    docx.Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "Planilla de Solicitud de Propuesta de Trabajo de Grado Experimental.docx");
      console.log("Document created successfully");
    });

    return of(null);

  }

}
