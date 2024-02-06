import { Injectable } from '@angular/core';
import { 
  TableRow,
  BorderStyle,
  WidthType,
  Paragraph,
  VerticalAlign,
  Document,
  TextRun, 
  AlignmentType,
  SectionType, 
  Header,
  HeightRule,
  TableCell,
  Footer, 
  LineRuleType,
  Table,
  PageBreak,
  HeadingLevel,
  Packer,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  TextDirection,
  ImageRun,
  CheckBox,
  Underline

} from 'docx';
import { saveAs } from 'file-saver';
import { Observable, catchError, from, of } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from "@angular/common/http";
import { ImageServiceService } from './image-service.service';
import { Criteria } from '../interfaces/criteria';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { Seccion } from '../interfaces/seccion';
import { FileChild } from 'docx/build/file/file-child';


const spacing = {
  after: 200,
  line: 255,
  lineRule: LineRuleType.AUTO,
};


const sin_bordes = {
  top: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  },
  bottom: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  },
  left: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  },
  right: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  }
}
const linea_superior = {
  bottom: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  },
  left: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  },
  right: {
      style: BorderStyle.NONE,
      size: 1,
      color: "ff0000",
  }
}
const celdaCuadrito = new TableCell({
                              children: [
                                  new Paragraph({
                                    children: [
                                        new CheckBox()
                                    ],
                                    alignment: "center"
                                  })
                              ],
                              width: {
                                size:`1cm`,
                                type: WidthType.DXA
                              },
                              verticalAlign: VerticalAlign.CENTER
                          })
const generarEncabezadoTablaEvaluacion = (alumno: any) => {
    if( alumno != undefined && alumno != null){
        let tabla = new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 9000,
                                            type: WidthType.DXA,
                                        },
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: "Nombre del Alumno:           " + alumno.apellidos + ', ' + alumno.nombres
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
        return tabla;
    }

    let tabla = new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: sin_bordes,
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: ""
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
    return tabla;
}
const generarTablaEvaluacion = (alumno: any) => {
  if( alumno != undefined && alumno != null){
      let tabla = new Table({
                      indent: {
                          size: 0,
                          type: WidthType.DXA,
                      },
                      rows: [
                          new TableRow({
                              children: [
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: ""
                                                  })
                                              ]
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "1"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "2"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "3"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "4"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "5"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "6"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "7"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "8"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "9"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "10"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "11"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 400,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "12"
                                                  })
                                              ],
                                              alignment: AlignmentType.CENTER
                                          })
                                      ]
                                  }),
                              ]
                          }),
                          new TableRow({
                              children: [
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "Calidad de la exposición: Dominio del tema"
                                                  })
                                              ]
                                          })
                                      ]
                                  }),
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                              ]
                          }),
                          new TableRow({
                              children: [
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "Desenvolvimiento del alumno (uso de los recursos, tono de voz, seguridad, manejo del espacio físico…):"
                                                  })
                                              ]
                                          })
                                      ]
                                  }),
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                              ]
                          }),
                          new TableRow({
                              children: [
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "Respuestas emitidas"
                                                  })
                                              ]
                                          })
                                      ]
                                  }),
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                                  celdaCuadrito,
                              ]
                          }),
                      ]
                  });
      return tabla;
  }

  let tabla = new Table({
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      borders: sin_bordes,
                      children: [
                          new Paragraph({
                              children: [
                                  new TextRun({
                                      text: ""
                                  })
                              ]
                          })
                      ]
                  })
              ]
          })
      ]
  })
  return tabla
}

const generarPonderacionAlumno = (alumno: any) => {
  if( alumno != undefined && alumno != null){
      let tabla = new Table({
                      rows: [
                          new TableRow({
                              children: [
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: "Total C (máximo 20)"
                                                  })
                                              ],
                                              alignment: AlignmentType.RIGHT
                                          })
                                      ]
                                  }),
                                  new TableCell({
                                      width: {
                                          size: 5000,
                                          type:  WidthType.DXA
                                      },
                                      children: [
                                          new Paragraph({
                                              children: [
                                                  new TextRun({
                                                      text: ""
                                                  })
                                              ]
                                          })
                                      ]
                                  }),
                              ]
                          })
                      ]
                  });
      return tabla;
  }

  let tabla = new Table({
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      borders: sin_bordes,
                      children: [
                          new Paragraph({
                              children: [
                                  new TextRun({
                                      text: ""
                                  })
                              ]
                          })
                      ]
                  })
              ]
          })
      ]
  })
  return tabla
}
const generarFirma = (rol: string, name: string) => {
  const table = new Table({
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      borders: sin_bordes,
                      children: [
                          new Table({
                              rows: [
                                  new TableRow({
                                      children: [
                                          new TableCell({
                                              borders: linea_superior,
                                              children: [
                                                  new Paragraph({
                                                      children: [
                                                          new TextRun({
                                                              text: "Fecha"
                                                          })
                                                      ],
                                                      alignment: AlignmentType.CENTER
                                                  })
                                              ],
                                              verticalAlign: VerticalAlign.CENTER,
                                              width: {
                                                  size: 2000,
                                                  type:  WidthType.DXA
                                              },
                                          })
                                      ]
                                  })
                              ]
                          })
                      ]
                  }),
                  new TableCell({
                      borders: sin_bordes,
                      children: [
                          new Table({
                              indent: {
                                  size: 250,
                                  type: WidthType.DXA,
                              },
                              rows: [
                                  new TableRow({
                                      children: [
                                          new TableCell({
                                              borders: linea_superior,
                                              children: [
                                                  new Paragraph({
                                                      children: [
                                                          new TextRun({
                                                              text: `${rol}`
                                                          })
                                                      ],
                                                      alignment: AlignmentType.CENTER
                                                  }),
                                                  new Paragraph({
                                                    children: [
                                                        new TextRun({
                                                            text: `${name}`
                                                        })
                                                    ],
                                                    alignment: AlignmentType.CENTER
                                                })
                                              ],
                                              verticalAlign: VerticalAlign.CENTER,
                                              width: {
                                                  size: 6000,
                                                  type:  WidthType.DXA
                                              },
                                          })
                                      ]
                                  })
                              ]
                          })
                      ]
                  }),
                  new TableCell({
                      borders: sin_bordes,
                      children: [
                          new Table({
                              indent: {
                                  size: 250,
                                  type: WidthType.DXA,
                              },
                              rows: [
                                  new TableRow({
                                      children: [
                                          new TableCell({
                                              borders: linea_superior,
                                              children: [
                                                  new Paragraph({
                                                      children: [
                                                          new TextRun({
                                                              text: "Firma"
                                                          })
                                                      ],
                                                      alignment: AlignmentType.CENTER
                                                  })
                                              ],
                                              verticalAlign: VerticalAlign.CENTER,
                                              width: {
                                                  size: 2000,
                                                  type:  WidthType.DXA
                                              },
                                          })
                                      ]
                                  })
                              ]
                          })
                      ]
                  }),
              ],
              height: {
                  value: 500,
                  rule: HeightRule.EXACT
              }
          })
      ]
  })
  return table;
}
const generarFilaAlumno = (alumno: {apellidos: string, nombres: string } | null) => {
  if(alumno){
    const fila = new TableRow({
      children: [
          new TableCell({
              children: [
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: alumno?.apellidos + ', '
                          })
                      ]
                  }),
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: alumno?.nombres
                          })
                      ]
                  })
              ]
          }),
          new TableCell({
              children: [
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: ""
                          })
                      ]
                  })
              ]
          }),
          new TableCell({
              children: [
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: ""
                          })
                      ]
                  })
              ]
          }),
          new TableCell({
              children: [
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: ""
                          })
                      ]
                  })
              ]
          }),
          new TableCell({
              children: [
                  new Paragraph({
                      children: [
                          new TextRun({
                              text: ""
                          })
                      ]
                  })
              ]
          }),
      ]
                 })

    return fila
  }
  return new TableRow({children: []});
}
const celdaVacia = new TableCell({
    children: [
        new Paragraph({
            children: [
                new TextRun({
                    text: ""
                })
            ]
        })
    ],
    verticalAlign: VerticalAlign.CENTER
});

@Injectable({
  providedIn: 'root'
})
export class EvaluationFormGeneratorService {
  imageArraBuffer: any
  bannerArrayBuffer: any;
  constructor(private userService: UsersService, private graduateWorkService: GraduateworkService, private imageService: ImageServiceService, private criteriosTutorEmpresarialService: CriteriosTutorEmpresarialService) {
    this.imageService.findImage("Screenshot 2024-01-29 at 01-25-50 Evaluación Pasantía Tutor Empresarial.docx.png").subscribe(
        {
            next: (imageArrayBuffer) => {
                console.log(imageArrayBuffer)
                this.imageArraBuffer = imageArrayBuffer
            },
            error: () => {
        
            }
        }
    )
    this.imageService.findImage("Screenshot 2024-01-29 at 01-30-02 Evaluación Pasantía Tutor Empresarial.docx.png").subscribe(
        {
            next: (imageArrayBuffer) => {
                console.log(imageArrayBuffer)
                this.bannerArrayBuffer = imageArrayBuffer
            },
            error: () => {
        
            }
        }
    )

   }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    const locale = "es-ES"; // Cambiar según el idioma deseado
  
    return date.toLocaleDateString(locale, options);
  }
  generateHeadingStudentTable( studentList: any, graduateWorkType: string, graduateWorkTitle: string ) : Table {
    return new Table({
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      width: {
                          size: 2000,
                          type: WidthType.DXA
                      },
                      children: [
                          new Paragraph({
                              children: [
                                  new TextRun({
                                      text: "Titulo " + graduateWorkType,
                                      bold: true
                                  })
                              ],
                              indent: {
                                  firstLine: 150
                              },
                          })
                      ]
                  }),
                  new TableCell({
                      width: {
                          size: 8000,
                          type: WidthType.DXA
                      },
                      children: [
                          new Paragraph({
                              children: [
                                  new TextRun({
                                      text: graduateWorkTitle,
                                      bold: true
                                  })
                              ],
                              indent: {
                                  firstLine: 400
                              },
                          })
                      ]
                  }),
              ],
              //Height
              height: {
                  value: 400,
                  rule: HeightRule.AUTO
              }
          }),
          generarFilaAlumno({apellidos: studentList[0].userLastname, nombres: studentList[0].userFirstName}),
      ]
  });

  } 

  generateIntershipDataTable( studentName:string, studentDNI: string, enterpriseName: string, tutorName: string) : Table {
    
    return new Table({
        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: `5.244cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Nombre del alumno"
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: `11.329cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: studentName
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Cédula de Identidad"
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: studentDNI
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Empresa:"
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: enterpriseName
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Nombre Tutor Empresarial"
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: 400,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: tutorName
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    }),
                ]
            })
            
        ]

    })
  }
  findMaxNote(notes: Criteria[]): number {
    let maxNote = -Infinity;
    for (const note of notes) {
      if (note.maxNote > maxNote) {
        maxNote = note.maxNote;
      }
    }
    return maxNote;
  }
  generateCriteriaEvaluationTable(criteriaArray: Criteria[],seccion: Seccion) : Table{
    /* Primero Injectamos las cabeceras de la tabla */
    const maxNoteInCriteriaList = this.findMaxNote(criteriaArray)
    const rowsGenerated :  TableRow[] = []
    const columnGenerated : TableCell[] = []

    console.log("recibimos")
    console.log(criteriaArray)
    console.log(seccion)


    const seccionCell = new TableCell({
                            width: {
                                size: `4cm`,
                                  type:  WidthType.DXA
                                },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: seccion.seccionName
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ],
                            verticalMerge: "continue"
                        })
        /* Para cada una de las secciones dentro de nuestra evaluacion insertamos el nombre */
        columnGenerated.push(
            seccionCell
        )
        /* Insertamos la cabecera de criterios */
        columnGenerated.push(
            new TableCell({
                width: {
                    size: `5cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Criterios de Evaluación"
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
        )
        /* Insertamos la cabecera de notas */
        for(let i = 0 ; i <= maxNoteInCriteriaList; i++){
            columnGenerated.push(
                new TableCell({
                    children: [
                        new Paragraph({
                        children: [
                            new TextRun({
                                text: i.toLocaleString()
                            })
                        ],
                        alignment: "center"
                        })
                    ],
                    width: {
                    size:`0.815cm`,
                    type: WidthType.DXA
                    },
                    verticalAlign: VerticalAlign.CENTER
            }))
        }

        /* Insertamos todo en la primera fila de nuestra tabla */

        rowsGenerated.push(
            new TableRow({
                children: columnGenerated
            })
        )
        /* Luego si el ID de la seccion del criterio coincide con la seccion actual lo agregamos */
        criteriaArray.forEach( (criteria) => {
            console.log(criteria)
            if(criteria.seccionId == seccion.seccionId){
                let noteCellArray: TableCell[] = []
                let criteriaCell: TableCell = 
                                            new TableCell({
                                                width: {
                                                    size: 400,
                                                    type:  WidthType.DXA
                                                },
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            new TextRun({
                                                                text: criteria.criteriaName
                                                            })
                                                        ],
                                                        alignment: AlignmentType.LEFT
                                                    })
                                                ]
                                            })
                noteCellArray.push(seccionCell)
                noteCellArray.push(criteriaCell)
                for(let i = 0; i <= criteria.maxNote; i++){
                    noteCellArray.push(celdaCuadrito)
                }
                
                rowsGenerated.push(
                    new TableRow({
                        children: noteCellArray
                    })
                )
            }
            
        })

    return new Table({

        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: rowsGenerated
    })

    /* Luego generamos por cada uno de los criterios un nuevo TableRow*/
    
  }

  generateAcademicCriteriaEvaluationTable(criteriaArray: Criteria[],seccion: Seccion) : Table{
    /* Primero Injectamos las cabeceras de la tabla */
    const maxNoteInCriteriaList = this.findMaxNote(criteriaArray)
    const rowsGenerated :  TableRow[] = []
    const columnGenerated : TableCell[] = []

    const seccionCell = new TableCell({
                            width: {
                                size: `5cm`,
                                type:  WidthType.DXA
                                },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: seccion.seccionName
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ],
                            verticalMerge: "continue"
                        })
        /* Para cada una de las secciones dentro de nuestra evaluacion insertamos el nombre */

        /* Insertamos todo en la primera fila de nuestra tabla */

    
        /* Luego si el ID de la seccion del criterio coincide con la seccion actual lo agregamos */
        criteriaArray.forEach( (criteria) => {
            if(criteria.seccionId == seccion.seccionId){
                console.log(criteria)
                let noteCellArray: TableCell[] = []
                let criteriaCell: TableCell = 
                                            new TableCell({
                                                width: {
                                                    size: "5cm",
                                                    type:  WidthType.DXA
                                                },
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            new TextRun({
                                                                text: criteria.criteriaName
                                                            })
                                                        ],
                                                        alignment: AlignmentType.LEFT
                                                    })
                                                ]
                                            })
                noteCellArray.push(seccionCell)
                noteCellArray.push(criteriaCell)
                for(let i = 0; i <= criteria.maxNote; i++){
                    noteCellArray.push(celdaCuadrito)
                }
                
                rowsGenerated.push(
                    new TableRow({
                        children: noteCellArray
                    })
                )
            }
            
        })


    return new Table({

        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: rowsGenerated
    })

    /* Luego generamos por cada uno de los criterios un nuevo TableRow*/
    
  }
  generateIntershipCorporateTutorEvaluationForm(criteriaArray: Criteria[],seccionArray: Seccion[], tableData: {nombreAlumno: string, cedulaAlumno: string, empresa: string, nombreTutor: string}) : Document {
    
    /* Debemos generar tablas por cada una de las secciones recibidas */

    const TutorEvaluationFormSquema: FileChild[] = []

    /* Primero cargamos el titulo de planilla */
    const formTitle = 
        new Paragraph({
            style: "titulo",
            children: [
                new TextRun({
                    text: "Evaluación Individual Pasantía – Tutor Empresarial",
                    bold: true
                }),
            ],
            spacing: {
                after: 200
            },
            alignment: AlignmentType.CENTER
        })

    TutorEvaluationFormSquema.push(formTitle)

    /* Luego cargamos la tabla de datos */

    const intershipDataTable: Table = this.generateIntershipDataTable(tableData.nombreAlumno,tableData.cedulaAlumno,tableData.empresa,tableData.nombreTutor);
    TutorEvaluationFormSquema.push(intershipDataTable)

    /* Cargamos un espacio para separar las tablas */

    const giveSpace = 
        new Paragraph({
            children: [
                new TextRun({
                    text: ""
                }),
            ],
            spacing: {
                after: 200,
                before: 200
            },
            alignment: AlignmentType.CENTER
        })

    TutorEvaluationFormSquema.push(giveSpace)

    /* Ahora por cada seccion que deba contener nuestra planilla vamos a generar una tabla y la insertaremos */

    seccionArray.forEach( (seccion) => {
        /* Cargamos la tabla de la seccion con cada uno de sus criterios */
        TutorEvaluationFormSquema.push(this.generateCriteriaEvaluationTable(criteriaArray,seccion))
        TutorEvaluationFormSquema.push(giveSpace)
        /* Generamos la tabla resumen que pondera el total de puntos  */
        TutorEvaluationFormSquema.push(
            new Table({
                indent: {
                    size: 0,
                    type: WidthType.DXA,
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: {
                                    size: `8.5cm`,
                                    type:  WidthType.DXA
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Total " + seccion.seccionName + "(Máximo " +  "[seccion.maxNote] " + "puntos)"
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT
                                    })
                                ]
                            }),
                            new TableCell({
                                width: {
                                    size: `8.5cm`,
                                    type:  WidthType.DXA
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Total " + seccion.seccionName + "[totalSum]" + " puntos"
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT
                                    })
                                ]
                            }),
                        ]
                    })
                    
                ]
            }),
            giveSpace
        )
    })

    /* Finalmente cargamos la tabla de ponderacion final */
    TutorEvaluationFormSquema.push(
        new Table({
            indent: {
                size: 0,
                type: WidthType.DXA,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: `8.5cm`,
                                type:  WidthType.DXA
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Total (máximo 20 puntos)"
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ]
                        }),
                        new TableCell({
                            width: {
                                size: `8.5cm`,
                                type:  WidthType.DXA
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Puntuacion TOTAL " + "[totalSum] "  + " puntos."
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ]
                        }),
                    ]
                })
                
            ]
        })
    )

    /* Cargamos el cuadro de observaciones */
    TutorEvaluationFormSquema.push(
        giveSpace,
        new Table({
            indent: {
                size: 0,
                type: WidthType.DXA,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: `16cm`,
                                type:  WidthType.DXA
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Observaciones: ",
                                            bold: true
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: `16cm`,
                                type:  WidthType.DXA
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "[Insertar observaciones aqui] "
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT
                                })
                            ]
                        })
                    ]
                }),
                
            ]
        })
    )

    /* Finalmente cargamos la linea de firma */
    TutorEvaluationFormSquema.push(
        giveSpace,
        generarFirma("Tutor Empresarial","[Inserte Nombre]")
    )

    const document =  new Document(
        {
            creator: "Luis C. Somoza & Wladimir San Vicente",
            title: "Evaluación Individual Pasantía – Tutor Empresarial",
            description: "Evaluación Individual Pasantía – Tutor Empresarial",
            styles: {
                default: {
                    heading1: {
                        run: {
                            size: 30,
                            bold: true,
                            italics: true,
                            color: "FF0000",
                        },
                        paragraph: {
                            spacing: {
                                after: 200,
                            },
                        },
                    },
                },
                paragraphStyles: [
                    {
                        id: "titulo",
                        name: "Aside",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            size: 24,
                        },
                        paragraph: {
                            spacing: {
                                line: 276,
                            },
                        },
                    },
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
                                line: 276,
                            },
                        },
                    },
                    {
                        id: "reducido",
                        name: "Reducido",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            size: 15,
                        },
                        paragraph: {
                            spacing: {
                                line: 276,
                            },
                        },
                    },
                    {
                        id: "despedida",
                        name: "Despedida",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            size: 26,
                        },
                        paragraph: {
                            spacing: {
                                line: 276,
                            },
                        },
                    }
                ]
            },
            sections: [{
                properties: {
                    type:  SectionType.CONTINUOUS
                },
                headers: {
                    default: new  Header({
                        children: [
                            new  Paragraph({
                            children: [
                                
                                new  ImageRun({
                                    data: this.imageArraBuffer,
                                    transformation: {
                                        width: 400,
                                        height: 100,
                                    },
                                })
                                
                            ],
                                alignment:  AlignmentType.LEFT
                            })
                        ],
                    }),
                },
                footers: {
                    default: new  Footer({
                        children: [
                            new  Paragraph({
                                children: [
                                    
                                    new  ImageRun({
                                        data: this.bannerArrayBuffer,
                                        transformation: {
                                            width: 600,
                                            height: 15,
                                        }
                                    }),
                                    
                                ],
                                alignment:  AlignmentType.CENTER
                            }),
                            new  Paragraph({
                                children: [
                                    new  TextRun({
                                        text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                                    })
                                ],
                                alignment:  AlignmentType.CENTER
                            }),
                            new  Paragraph({
                                children: [
                                    new  TextRun({
                                        text: "Avenida Atlántico, Ciudad Guayana 8050",
                                    })
                                ],
                                alignment:  AlignmentType.CENTER
                            }),
                            new  Paragraph({
                                children: [
                                    new  TextRun({
                                        text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                                    })
                                ],
                                alignment:  AlignmentType.CENTER
                            }),
                            new  Paragraph({
                                children: [
                                    new  TextRun({
                                        text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                                    })
                                ],
                                alignment:  AlignmentType.CENTER
                            })
                        ],
                    }),
                },
                children: TutorEvaluationFormSquema
            }]
        }
    )
    return document
    
  }


  generateIntershipAcademicTutorEvaluationForm(criteriaArray: Criteria[],seccionArray: Seccion[], tableData: {nombreAlumno: string, cedulaAlumno: string, empresa: string, nombreTutor: string}) : Document {
    /* Debemos generar tablas por cada una de las secciones recibidas */

    const TutorEvaluationFormSquema: FileChild[] = []

    /* Primero cargamos el titulo de planilla */
    const formTitle = 
        new Paragraph({
            style: "titulo",
            children: [
                new TextRun({
                    text: "Evaluación Individual Pasantía – Tutor Académico",
                    bold: true
                }),
            ],
            spacing: {
                after: 200
            },
            alignment: AlignmentType.CENTER
        })

    TutorEvaluationFormSquema.push(formTitle)

    /* Luego cargamos la tabla de datos */

    const intershipDataTable: Table = this.generateIntershipDataTable(tableData.nombreAlumno,tableData.cedulaAlumno,tableData.empresa,tableData.nombreTutor);
    TutorEvaluationFormSquema.push(intershipDataTable)

    /* Cargamos un espacio para separar las tablas e insertamos una tabla como cabecera */

    const giveSpace = 
        new Paragraph({
            children: [
                new TextRun({
                    text: ""
                }),
            ],
            spacing: {
                after: 100,
                before: 100
            },
            alignment: AlignmentType.CENTER
        })

    TutorEvaluationFormSquema.push(giveSpace)

    const tablaCabecera = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "Secciones de evaluación"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "5cm"
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "Criterios de Evaluación"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "5cm"
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "0"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "1cm"
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "1"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "1cm"
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "2"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "1cm"
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: "Total"
                            })
                        ],
                        width: {
                            type: WidthType.DXA,
                            size: "2.5cm"
                        }
                    })
                ]
            })
        ]
    })
    TutorEvaluationFormSquema.push(tablaCabecera)
    TutorEvaluationFormSquema.push(giveSpace)
    /* Ahora por cada seccion que deba contener nuestra planilla vamos a generar una tabla y la insertaremos */

    seccionArray.forEach( (seccion) => {
        /* Cargamos la tabla de la seccion con cada uno de sus criterios */
        TutorEvaluationFormSquema.push(this.generateAcademicCriteriaEvaluationTable(criteriaArray,seccion))
        /* Generamos la tabla resumen que pondera el total de puntos  */
        TutorEvaluationFormSquema.push(
            new Table({
                indent: {
                    size: 0,
                    type: WidthType.DXA,
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: {
                                    size: `5cm`,
                                    type:  WidthType.DXA
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `Total ${seccion.seccionName} (Máximo ${seccion.maxNote} puntos)`
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT
                                    })
                                ],
                            }),
                            new TableCell({
                                width: {
                                    size: `10.5cm`,
                                    type:  WidthType.DXA
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Total " + seccion.seccionName + "[totalSum]" + " puntos"
                                            })
                                        ],
                                        alignment: AlignmentType.RIGHT,
                                        indent: {
                                            right: "0.5cm"
                                        }
                                    })
                                ],
                                columnSpan: 3,
                                verticalAlign: "bottom"
                            }),
        
                        ]
                    })
                    
                ]
            })
        )
    })

    TutorEvaluationFormSquema.push(giveSpace)
/* Finalmente cargamos la tabla de ponderacion final */
TutorEvaluationFormSquema.push(
    new Table({
        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: `5cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Total (máximo 20 puntos)"
                                    })
                                ],
                                alignment: AlignmentType.RIGHT
                            })
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: `11cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Puntuacion TOTAL " + "[totalSum] "  + " puntos."
                                    })
                                ],
                                alignment: AlignmentType.RIGHT,
                                indent: {
                                    right: "1cm"
                                }
                            })
                        ],
                        verticalAlign: "bottom",
                    }),
                ]
            })
            
        ]
    })
)

/* Cargamos el cuadro de observaciones */
TutorEvaluationFormSquema.push(
    giveSpace,
    new Table({
        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: `16cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Observaciones: ",
                                        bold: true
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: `16cm`,
                            type:  WidthType.DXA
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "[Insertar observaciones aqui] "
                                    })
                                ],
                                alignment: AlignmentType.LEFT
                            })
                        ]
                    })
                ]
            }),
            
        ]
    })
)

/* Finalmente cargamos la linea de firma */
TutorEvaluationFormSquema.push(
    giveSpace,
    generarFirma("Tutor Empresarial","[Inserte Nombre]")
)

const document =  new Document(
    {
        creator: "Luis C. Somoza & Wladimir San Vicente",
        title: "Evaluación Individual Pasantía – Tutor Empresarial",
        description: "Evaluación Individual Pasantía – Tutor Empresarial",
        styles: {
            default: {
                heading1: {
                    run: {
                        size: 30,
                        bold: true,
                        italics: true,
                        color: "FF0000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "titulo",
                    name: "Aside",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 24,
                    },
                    paragraph: {
                        spacing: {
                            line: 276,
                        },
                    },
                },
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
                            line: 276,
                        },
                    },
                },
                {
                    id: "reducido",
                    name: "Reducido",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 15,
                    },
                    paragraph: {
                        spacing: {
                            line: 276,
                        },
                    },
                },
                {
                    id: "despedida",
                    name: "Despedida",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 26,
                    },
                    paragraph: {
                        spacing: {
                            line: 276,
                        },
                    },
                }
            ]
        },
        sections: [{
            properties: {
                type:  SectionType.CONTINUOUS
            },
            headers: {
                default: new  Header({
                    children: [
                        new  Paragraph({
                        children: [
                            
                            new  ImageRun({
                                data: this.imageArraBuffer,
                                transformation: {
                                    width: 400,
                                    height: 100,
                                },
                            })
                            
                        ],
                            alignment:  AlignmentType.LEFT
                        })
                    ],
                }),
            },
            footers: {
                default: new  Footer({
                    children: [
                        new  Paragraph({
                            children: [
                                
                                new  ImageRun({
                                    data: this.bannerArrayBuffer,
                                    transformation: {
                                        width: 600,
                                        height: 15,
                                    }
                                }),
                                
                            ],
                            alignment:  AlignmentType.CENTER
                        }),
                        new  Paragraph({
                            children: [
                                new  TextRun({
                                    text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                                })
                            ],
                            alignment:  AlignmentType.CENTER
                        }),
                        new  Paragraph({
                            children: [
                                new  TextRun({
                                    text: "Avenida Atlántico, Ciudad Guayana 8050",
                                })
                            ],
                            alignment:  AlignmentType.CENTER
                        }),
                        new  Paragraph({
                            children: [
                                new  TextRun({
                                    text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                                })
                            ],
                            alignment:  AlignmentType.CENTER
                        }),
                        new  Paragraph({
                            children: [
                                new  TextRun({
                                    text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                                })
                            ],
                            alignment:  AlignmentType.CENTER
                        })
                    ],
                }),
            },
            children: TutorEvaluationFormSquema
        }]
    }
)
return document
   
  }
  generateEvaluationForm(evaluationFormData: any) : Document {
    console.log(evaluationFormData)
    return new  Document({
      creator: "Luis C. Somoza & Wladimir San Vicente",
      title: "Planilla Evaluación Presentación Oral Trabajo Experimental de Grado (TEG)",
      description: "Planilla Evaluación Presentación Oral Trabajo Experimental de Grado (TEG)",
      styles: {
          default: {
              heading1: {
                  run: {
                      size: 30,
                      bold: true,
                      italics: true,
                      color: "FF0000",
                  },
                  paragraph: {
                      spacing: {
                          after: 200,
                      },
                  },
              },
          },
          paragraphStyles: [
              {
                  id: "titulo",
                  name: "Aside",
                  basedOn: "Normal",
                  next: "Normal",
                  run: {
                      size: 24,
                  },
                  paragraph: {
                      spacing: {
                          line: 276,
                      },
                  },
              },
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
                          line: 276,
                      },
                  },
              },
              {
                  id: "reducido",
                  name: "Reducido",
                  basedOn: "Normal",
                  next: "Normal",
                  run: {
                      size: 15,
                  },
                  paragraph: {
                      spacing: {
                          line: 276,
                      },
                  },
              },
              {
                  id: "despedida",
                  name: "Despedida",
                  basedOn: "Normal",
                  next: "Normal",
                  run: {
                      size: 26,
                  },
                  paragraph: {
                      spacing: {
                          line: 276,
                      },
                  },
              }
          ]
      },
      sections: [{
          properties: {
              type:  SectionType.CONTINUOUS
          },
          headers: {
              default: new  Header({
                  children: [new  Paragraph({
                      children: [
                          
                          new  ImageRun({
                              data: this.imageArraBuffer,
                              transformation: {
                                  width: 400,
                                  height: 100,
                              },
                          }),
                          
                      ],
                      alignment:  AlignmentType.LEFT
                  })],
              }),
          },
          footers: {
              default: new  Footer({
                  children: [
                      new  Paragraph({
                          children: [
                              
                              new  ImageRun({
                                  data: this.bannerArrayBuffer,
                                  transformation: {
                                      width: 600,
                                      height: 15,
                                  }
                              }),
                              
                          ],
                          alignment:  AlignmentType.CENTER
                      }),
                      new  Paragraph({
                          children: [
                              new  TextRun({
                                  text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                              })
                          ],
                          alignment:  AlignmentType.CENTER
                      }),
                      new  Paragraph({
                          children: [
                              new  TextRun({
                                  text: "Avenida Atlántico, Ciudad Guayana 8050",
                              })
                          ],
                          alignment:  AlignmentType.CENTER
                      }),
                      new  Paragraph({
                          children: [
                              new  TextRun({
                                  text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                              })
                          ],
                          alignment:  AlignmentType.CENTER
                      }),
                      new  Paragraph({
                          children: [
                              new  TextRun({
                                  text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                              })
                          ],
                          alignment:  AlignmentType.CENTER
                      })
                  ],
              }),
          },
          children: [
              new Paragraph({
                  style: "titulo",
                  children: [
                      new TextRun({
                          text: "Planilla Evaluación Presentación Oral - Trabajo Experimental de Grado (TEG)",
                          bold: true
                      })
                  ],
                  spacing: {
                      after: 200
                  },
                  alignment: AlignmentType.CENTER
              }),
              /* Tabla Encabezado con alumnos*/
              this.generateHeadingStudentTable(evaluationFormData.studentList,evaluationFormData.graduateWorkData.graduateWorkType, evaluationFormData.graduateWorkData.graduateWorkTitle),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: {
                      after: 100,
                      before: 100
                  }
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: "La presente planilla consta de dos secciones:"
                      })
                  ],
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: "Sección B: Evaluación de la presentación, común para ambos alumnos (si son dos)"
                      })
                  ],
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: "Sección C: Evaluación individual de la presentación y defensa, la cual debe llenar individual"
                      })
                  ],
                  spacing: spacing
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: "B: Evaluación de la Presentación y Defensa (Común para ambos Alumnos)",
                          bold: true
                      })
                  ],
                  spacing: spacing
              }),
              new Table({
                  indent: {
                      size: 0,
                      type: WidthType.DXA,
                  },
                  rows: [
                      new TableRow({
                          children: [
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: ""
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "1"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "2"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "3"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "4"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "5"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "6"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "7"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "8"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "9"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "10"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "11"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 400,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "12"
                                              })
                                          ],
                                          alignment: AlignmentType.CENTER
                                      })
                                  ]
                              }),
                          ]
                      }),
                      new TableRow({
                          children: [
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Tiempo de la presentación (30 minutos)"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                          ]
                      }),
                      new TableRow({
                          children: [
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Contenido y organización de la presentación"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                          ]
                      }),
                      new TableRow({
                          children: [
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Demostración del producto obtenido"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                              celdaCuadrito,
                          ]
                      }),
                  ]
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              new Table({
                  rows: [
                      new TableRow({
                          children: [
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Total B (máximo 20)"
                                              })
                                          ],
                                          alignment: AlignmentType.RIGHT
                                      })
                                  ]
                              }),
                              new TableCell({
                                  width: {
                                      size: 5000,
                                      type:  WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: ""
                                              })
                                          ]
                                      })
                                  ]
                              }),
                          ]
                      })
                  ]
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: "C1: Evaluación Individual de la Presentación y Defensa - " + evaluationFormData.studentList[0].userLastName + ', ' +  evaluationFormData.studentList[0].userFirstName,
                          bold: true
                      })
                  ],
                  spacing: spacing
              }),
              //generarEncabezadoTablaEvaluacion(notificacion.alumnos[0]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              //generarTablaEvaluacion(notificacion.alumnos[0]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              //generarPonderacionAlumno(notificacion.alumnos[0]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              //generarEncabezadoTablaEvaluacion(notificacion.alumnos[1]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              //generarTablaEvaluacion(notificacion.alumnos[1]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              //generarPonderacionAlumno(notificacion.alumnos[1]),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: ""
                      })
                  ],
                  spacing: spacing
              }),
              new Table({
                  rows: [
                      new TableRow({
                          children: [
                              new TableCell({
                                  borders: {
                                      right: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",
                                      }
                                  },
                                  width: {
                                      size: 1000,
                                      type: WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Fecha"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              new TableCell({
                                  borders: {
                                      right: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",
                                      },
                                      left: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",  
                                      }
                                  },
                                  width: {
                                      size: 4000,
                                      type: WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: this.formatDate(new Date())
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              new TableCell({
                                  borders: {
                                      right: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",
                                      },
                                      left: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",  
                                      }
                                  },
                                  width: {
                                      size: 1000,
                                      type: WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "Jurado"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                              new TableCell({
                                  borders: {
                                      left: {
                                          style: BorderStyle.NONE,
                                          size: 1,
                                          color: "ff0000",  
                                      }
                                  },
                                  width: {
                                      size: 4000,
                                      type: WidthType.DXA
                                  },
                                  children: [
                                      new Paragraph({
                                          children: [
                                              new TextRun({
                                                  text: "[Inserte nombre del jurado aquí]"
                                              })
                                          ]
                                      })
                                  ]
                              }),
                          ]
                      })
                  ]
              })
          ]
      }]
  });
  }

  generateIntershipCorporateTutorNotification(
    Carta_designacion: {
        consejo: string,
        fechaConsejo: Date,
        propuesta: {
            tutor_academico: {
                apellidos: string,
                nombres: string
            },
            titulo: string,
            alumno: {apellidos: string, nombres: string}
        },
        fecha_designacion: Date,
        revisor: string,
        correo_administrador: string,
        administrador: string   
    }
  ) : Document
    
  {

    const doc = new Document({
        creator: "Luis C. Somoza",
        title: "Notificación Aprobación de Pasantía y Tutor Académico",
        description: "Notificación Aprobación de Pasantía y Tutor Académico",
        styles: {
            default: {
                heading1: {
                    run: {
                        size: 30,
                        bold: true,
                        italics: true,
                        color: "FF0000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
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
                            line: 276,
                        },
                    },
                },
                {
                    id: "title",
                    name: "Aside",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 30,
                        bold: true,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
                    },
                },
                {
                    id: "fecha",
                    name: "Aside",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 22,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
                        alignment: AlignmentType.RIGHT
                    },
                },
                {
                    id: "despedida",
                    name: "Despedida",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 26,
                    },
                    paragraph: {
                        spacing: {
                            line: 276,
                        },
                    },
                }
            ]
        },
        numbering: {
            config: [
                {
                    reference: "my-crazy-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "decimal",
                            text: "%1. ",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 760, hanging: 260 },
                                    alignment: AlignmentType.JUSTIFIED
                                },
                            },
                        },
                        {
                            level: 1,
                            format: "decimal",
                            text: "%2.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 1440, hanging: 980 },
                                },
                            },
                        },
                        {
                            level: 2,
                            format: "lowerLetter",
                            text: "%3)",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 2160, hanging: 1700 },
                                },
                            },
                        },
                        {
                            level: 3,
                            format: "upperLetter",
                            text: "%4)",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 2880, hanging: 2420 },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: "arrow-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "bullet",
                            text: "%1. ",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 760, hanging: 260 },
                                    alignment: AlignmentType.JUSTIFIED
                                },
                            },
                        }
                    ]
                }
            ],
        },
        sections: [{
            properties: {
                type: SectionType.CONTINUOUS
            },
            headers: {
                default: new Header({
                    children: [new Paragraph({
                        children: [
                            
                            new ImageRun({
                                data: this.imageArraBuffer,
                                transformation: {
                                    width: 400,
                                    height: 100,
                                },
                            }),
                            
                        ],
                        alignment: AlignmentType.LEFT
                    })],
                }),
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                
                                new ImageRun({
                                    data: this.bannerArrayBuffer,
                                    transformation: {
                                        width: 600,
                                        height: 15,
                                    }
                                }),
                                
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Avenida Atlántico, Ciudad Guayana 8050",
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        })
                    ],
                }),
            },
            children: [
                new Paragraph({
                    style: "title",
                    children: [
                        new TextRun({
                            text: "Notificación Aprobación de Pasantía y Tutor Académico",
                            font: "Trebuchet MS"
                        })
                    ],
                    alignment: AlignmentType.CENTER
                }),
                new Paragraph({
                    style: "fecha",
                    children: [
                        new TextRun({
                            text: `Ciudad Guayana, ${this.formatDate(Carta_designacion.fecha_designacion)}`,
                            font: "Trebuchet MS",
                        })
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    },
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: 'Estudiante: ' + Carta_designacion.propuesta.alumno.apellidos + ", " + Carta_designacion.propuesta.alumno.nombres,
                            bold: true,
                            font: "Trebuchet MS"
                        })
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: `Me es grato dirigirme a Usted en oportunidad de informarle que en Consejo de Escuela N° ${Carta_designacion.consejo} de fecha ${this.formatDate(Carta_designacion.fechaConsejo)},  ha sido aprobada su Propuesta de Pasantía y designado como Tutor Académico de la misma al profesor(a): ${Carta_designacion.revisor} `,  
                            font: "Trebuchet MS"
                        }),
 

                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    indent: {
                        firstLine: 400
                    },
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "Bienvenido a su Pasantía, deseándole el mayor de los éxitos en la realización de las misma. Los procedimientos que debe seguir durante su Pasantía son: ",
                            font: "Trebuchet MS"
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    indent: {
                        firstLine: 400
                    },
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    
                    children: [
                        new TextRun({
                            text: "Procedimiento para Desarrollo de Pasantía: ",
                            font: "Trebuchet MS",
                            bold: true
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "Usted debe desarrollar su Pasantía de acuerdo a la Propuesta de Pasantía aprobada. ",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "El Tutor Empresarial, le dará una inducción para adaptarlo a la organización y lo dirigirá y asesorará en su permanencia en la empresa, brindándole las facilidades relacionadas con: ubicación, materiales, obtención de información de otras unidades organizativas, entre otras. ",
                            font: "Trebuchet MS"
                        }),
                    ],
                    
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "En caso de dudas respecto a procedimientos metodológicos o técnicos que no puedan ser solventados por el Tutor Empresarial, usted solicitará asesoramiento a su Tutor Académico, reuniéndose con él según él lo considere en forma presencial o virtual. ",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "El viernes de cada semana que dure la Pasantía, usted debe reportar a su Tutor Académico las actividades y productos obtenidos durante esa semana, utilizando el formato de Informe Actividades Pasantía, enviándole un correo a su Tutor con el respectivo informe.",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "Debe realizar su Informe de Pasantía a lo largo de la Pasantía, en particular protocolos de pruebas (en caso de un desarrollo) y el manual de Sistema",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                /* Procedimiento para finalizar la pasantia */
                new Paragraph({
                    style: "aside",
                    
                    children: [
                        new TextRun({
                            text: "Procedimiento para Finalizar de Pasantía: ",
                            font: "Trebuchet MS",
                            bold: true
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                        instance: 2
                        
                    },
                    children: [
                        new TextRun({
                            text: "Al finalizar la Pasantía, usted entregará un informe sobre el trabajo realizado (a más tardar una semana posterior a la fecha de finalización de la pasantía), al Tutor Empresarial. Este informe debe cumplir con lo estipulado en la Guía Informe de Pasantía. Él lo revisará, en caso de tener alguna observación, se la hará llegar y cuando esté conforme con el mismo, el Tutor Empresarial realizará la evaluación y la enviará al Coordinador de Pasantía con copia al Tutor Académico y a usted (Dispone de máximo una semana).",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "Luego de la evaluación y aprobación del informe por el Tutor Empresarial, usted enviará el informe al Tutor Académico, el cual lo revisará, en caso de tener alguna observación, se la hará llegar y cuando esté conforme con el mismo, el Tutor Académico realizará la evaluación y la enviará al Coordinador de Pasantía con copia a usted. (Dispone de máximo una semana).",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "Luego de la evaluación y aprobación del informe por el Tutor Académico, usted enviará el informe al Coordinador de Pasantía anexando después de la primera página las evaluaciones del Tutor Empresarial y Tutor Académico. (Dispone de máximo una semana).",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    numbering: {
                        reference: "my-crazy-numbering",
                        level: 0,
                    },
                    children: [
                        new TextRun({
                            text: "El Coordinador de Pasantía enviará las evaluaciones al director de la Escuela, para ser cargadas respectivamente en el sistema.",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "Anexo los siguientes documentos a utilizar durante la realización de su Pasantía:",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Informe Actividades Pasantía, utilizado por usted para reportar las actividades y productos obtenidos durante cada semana",
                            font: "Trebuchet MS"
                        }),
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "despedida",
                    children: [
                        new TextRun({
                            text: Carta_designacion.administrador,
                            italics: true,
                            bold: true,
                            font: "Courgette"
                        })
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                })
            ],
        }]
    });

    return doc;

  }

  generateIntershipDesignationTable(tableData: {
    estudiante: {
        nombre: string,
        cedula: string
    },
    empresa: string,
    titulo: string,
    fechaInicio: Date,
    fechaFin: Date,
    tutorEmpresarial: string
  }) : Table {

    const rowsGenerated: TableRow[] = []

    /* Insertamos las cabeceras */
    const filaCabeceraTabla = new TableRow({
        children: [
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Estudiante",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Cédula",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Empresa",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `5cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Título",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Inicio",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Fin",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: "Tutor Empresarial",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),

        ]
    })

    rowsGenerated.push(filaCabeceraTabla);

    /* Cargamos los datos del alumno */

    const filaDatosPasantia = new TableRow({
        children: [
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: tableData.estudiante.nombre
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: tableData.estudiante.cedula
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: tableData.empresa
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `5cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: tableData.titulo
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: this.formatDate(tableData.fechaInicio as Date)
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: this.formatDate(tableData.fechaFin as Date)
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
            new TableCell({
                width: {
                    size: `2cm`,
                    type:  WidthType.DXA
                },
                children: [
                    new Paragraph({
                        style: "aside",
                        children: [
                            new TextRun({
                                text: tableData.tutorEmpresarial
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ]
            }),
        ]
    })

    rowsGenerated.push(filaDatosPasantia);

    return new Table({
        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        rows: rowsGenerated
    })
  }
  generateIntershipAcademicTutorNotification(
    notificationData: {
        fechaEnvio: Date,
        academicTutor: string,
        consejoDeEscuela: string,
        fechaConsejo: Date,
        datosEstudiante: {
            nombre: string,
            cedula: string
        }
        empresa: string,
        titulo: string,
        fechaInicio: Date,
        fechaFin: Date,
        tutorEmpresarial: string,
        administrador: string
    }
  ) : Document
  {

    const doc = new Document({
        creator: "Luis C. Somoza",
        title: "Designación Tutor Académico Pasantía  ",
        description: "Designación Tutor Académico Pasantía    " ,
        styles: {
            default: {
                heading1: {
                    run: {
                        size: 30,
                        bold: true,
                        italics: true,
                        color: "FF0000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
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
                            line: 276,
                        },
                    },
                },
                {
                    id: "title",
                    name: "Aside",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 30,
                        bold: true,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
                    },
                },
                {
                    id: "fecha",
                    name: "Aside",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 22,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: {
                            after: 200,
                        },
                        alignment: AlignmentType.RIGHT
                    },
                },
                {
                    id: "despedida",
                    name: "Despedida",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 26,
                    },
                    paragraph: {
                        spacing: {
                            line: 276,
                        },
                    },
                }
            ]
        },
        numbering: {
            config: [
                {
                    reference: "my-crazy-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "decimal",
                            text: "%1. ",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 760, hanging: 260 },
                                    alignment: AlignmentType.JUSTIFIED
                                },
                            },
                        },
                        {
                            level: 1,
                            format: "decimal",
                            text: "%2.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 1440, hanging: 980 },
                                },
                            },
                        },
                        {
                            level: 2,
                            format: "lowerLetter",
                            text: "%3)",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 2160, hanging: 1700 },
                                },
                            },
                        },
                        {
                            level: 3,
                            format: "upperLetter",
                            text: "%4)",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 2880, hanging: 2420 },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: "arrow-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "bullet",
                            text: "%1. ",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 760, hanging: 260 },
                                    alignment: AlignmentType.JUSTIFIED
                                },
                            },
                        }
                    ]
                }
            ],
        },
        sections: [{
            properties: {
                type: SectionType.CONTINUOUS
            },
            headers: {
                default: new Header({
                    children: [new Paragraph({
                        children: [
                            
                            new ImageRun({
                                data: this.imageArraBuffer,
                                transformation: {
                                    width: 400,
                                    height: 100,
                                },
                            }),
                            
                        ],
                        alignment: AlignmentType.LEFT
                    })],
                }),
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                
                                new ImageRun({
                                    data: this.bannerArrayBuffer,
                                    transformation: {
                                        width: 600,
                                        height: 15,
                                    }
                                }),
                                
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "UNIVERSIDAD CATÓLICA ANDRÉS BELLO – Extensión Guayana",
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Avenida Atlántico, Ciudad Guayana 8050",
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Bolívar, Venezuela. Teléfono: +58-286-6000111"
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "URL: http://www.guayanaweb.ucab.edu.ve/escuela-de-ingenieria-informatica.html"
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        })
                    ],
                }),
            },
            children: [
                new Paragraph({
                    style: "title",
                    children: [
                        new TextRun({
                            text: "Designación Tutor Académico Pasantía ",
                            font: "Trebuchet MS"
                        })
                    ],
                    alignment: AlignmentType.CENTER
                }),
                new Paragraph({
                    style: "fecha",
                    children: [
                        new TextRun({
                            text: `Ciudad Guayana, ${this.formatDate(notificationData.fechaEnvio)}`,
                            font: "Trebuchet MS",
                        })
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    },
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: 'Profesor: ' + notificationData.academicTutor,
                            bold: true,
                            font: "Trebuchet MS"
                        })
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: 'Presente. -',
                            bold: true,
                            font: "Trebuchet MS"
                        })
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: `Me es grato dirigirme a Usted en oportunidad de informarle que en Consejo de Escuela N° ${notificationData.consejoDeEscuela} de fecha ${this.formatDate(notificationData.fechaConsejo)}, ha sido aprobada la Pasantía mencionada a continuación y usted ha sido designado como Tutor Académico de la misma. `,  
                            font: "Trebuchet MS"
                        }),
 

                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    indent: {
                        firstLine: 400
                    },
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                this.generateIntershipDesignationTable(

                    {
                        estudiante: {
                            nombre: notificationData.datosEstudiante.nombre,
                            cedula: notificationData.datosEstudiante.cedula
                        },
                        empresa: notificationData.empresa,
                        titulo: notificationData.empresa,
                        fechaInicio: notificationData.fechaInicio,
                        fechaFin: notificationData.fechaFin,
                        tutorEmpresarial: notificationData.tutorEmpresarial
                    }

                ),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "Usted debe cumplir con las funciones de acompañamiento, seguimiento y evaluación de la mencionada Pasantía: ",
                            font: "Trebuchet MS"
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    indent: {
                        firstLine: 400
                    },
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Acompañamiento, usted debe apoyar al estudiante en caso de dudas respecto a procedimientos metodológicos o técnicos que no puedan ser solventados por el Tutor Empresarial, reuniéndose con él las veces que considere necesario. Según Artículo 10 del Reglamento de Pasantías de la Facultad de Ingeniería por lo menos una vez durante la Pasantía en forma presencial o virtual. ",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Seguimiento, cada semana el estudiante debe reportar las actividades y productos obtenidos durante esa semana, utilizando el formato de Informe Actividades Pasantía y usted debe verificarlo.",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Evaluación, al finalizar la Pasantía, el estudiante le entregará un informe sobre el trabajo realizado, previa evaluación y aprobación del mismo por el Tutor Empresarial. Este informe debe cumplir con lo estipulado en la Guía Elaboración Informe de Pasantía y usted debe verificarlo.",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                /* Para cumplir estas funciones, usted dispone de los siguientes documentos */
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "Para cumplir con estas funciones, usted dispone de los siguientes documentos: ",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Propuesta de Pasantía aprobado por el Consejo de Escuela, en esta propuesta se describe el objetivo, alcance y cronograma de trabajo que realizará el estudiante, describiendo por objetivo las tareas a realizar con las fechas de inicio y de fin de cada una",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Formato Informe Actividades Pasantía, utilizado por el estudiante para reportar las actividades y productos obtenidos durante cada semana",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Guía Elaboración Informe de Pasantía, utilizado por el estudiante para la realización de su Informe de Pasantía.",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Guía Normas APA Formato - IINF Gy, utilizado para el formato del Informe de Pasantía. ",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    bullet: {
                        level: 0
                    },
                    children: [
                        new TextRun({
                            text: "Planilla de Evaluación Pasantía Tutor Académico, donde usted indicará su evaluación definitiva de la Pasantía de acuerdo a cada uno de los ítems. ",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "La Escuela de Ingeniería Informática desea expresarle un especial agradecimiento por su participación como tutor y evaluador de esta Pasantía.",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "aside",
                    children: [
                        new TextRun({
                            text: "Atentamente,",
                            font: "Trebuchet MS",
    
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                }),
                new Paragraph({
                    style: "despedida",
                    children: [
                        new TextRun({
                            text: notificationData.administrador,
                            italics: true,
                            bold: true,
                            font: "Courgette"
                        })
                    ],
                    spacing: {
                        after: 200,
                        line: 355,
                        lineRule: LineRuleType.AUTO,
                    }
                })
            ],
        }]
    });

    return doc;

  }

  convertDocumentToBlob(document: Document) : Observable<Blob>{
    return  from(Packer.toBlob(document))
  }

  printEvaluationForm(document: Document){
    Packer.toBlob(document).then( blob => {
      saveAs(blob, "Prototipo de Planilla I"+".docx");
     //console.log("Documento creado de forma exitosa en el navegador");
    });
  }
}
