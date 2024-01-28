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
  ImageRun

} from 'docx';
import { saveAs } from 'file-saver';
import { Observable, from, of } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';


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
                                  new Table({
                                      indent: {
                                          size: 100,
                                          type: WidthType.DXA,
                                      },
                                      //columnWidths: [300,300],
                                      rows: [
                                          new TableRow({
                                              children: [
                                                  new TableCell({
                                                      width: {
                                                          size: 150,
                                                          type: WidthType.DXA,
                                                      },
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
                                                  })
                                              ],
                                              height: {
                                                  value: 150,
                                                  rule: HeightRule.EXACT
                                              }
                                          })
                                      ]
                                  })
                              ],
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
const generarFirma = () => {
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
                                                              text: "Nombre presidente del Jurado"
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
                  value: 400,
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

@Injectable({
  providedIn: 'root'
})
export class EvaluationFormGeneratorService {

  constructor(private userService: UsersService, private graduateWorkService: GraduateworkService) { }

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
                          /*
                          new  ImageRun({
                              data: fs.readFileSync('logo.png'),
                              transformation: {
                                  width: 400,
                                  height: 100,
                              },
                          }),
                          */
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
                              /*
                              new  ImageRun({
                                  data: fs.readFileSync('Untitled.png'),
                                  transformation: {
                                      width: 600,
                                      height: 15,
                                  },
                                  alignment:  AlignmentType.CENTER
                              }),
                              */
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
                                                  text: new Date().toLocaleDateString()
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

  printEvaluationForm(document: Document){
    Packer.toBlob(document).then( blob => {
      saveAs(blob, "Prototipo de Planilla I"+".docx");
     //console.log("Documento creado de forma exitosa en el navegador");
    });
  }
}
