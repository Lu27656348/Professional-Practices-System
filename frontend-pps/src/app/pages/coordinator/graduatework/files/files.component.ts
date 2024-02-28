import { Component,OnInit} from '@angular/core';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import { DocumentService } from 'src/app/services/document.service';

function getFilePath(node: TreeNode, fileName: string, parentPath: string = ""): string | null {
  // Si el nombre del archivo coincide con el nombre del nodo, devolvemos la ruta completa
  if (node.name === fileName) {
    return parentPath + "/" + fileName;
  }

  // Si el nodo no tiene hijos, devolvemos nulo
  if (!node.children) {
    return null;
  }

  // Buscamos el archivo en los hijos del nodo
  for (const child of node.children) {
    const path = getFilePath(child, fileName, parentPath + "/" + node.name);

    // Si encontramos el archivo en un hijo, devolvemos la ruta completa
    if (path !== null) {
      return path;
    }
  }

  // Si no encontramos el archivo en ningún hijo, devolvemos nulo
  return null;
}
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface TreeNode {
  name: string;
  children?: TreeNode[];  // Actualizamos el tipo de children
}

interface FlatTreeNode {
  level: number;
  expandable: boolean;
  name: string;
}
const TREE_DATA: TreeNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
]
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit{
  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };

  treeControl = new FlatTreeControl<FlatTreeNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node =>  node.children,
  );

  filesData: any = []
  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI',"check"];
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private graduateWorkService: GraduateworkService, private documentService: DocumentService) {
    //this.dataSource.data = TREE_DATA
    console.log(this.dataSource)
    console.log(this.dataSource.data)
    this.graduateWorkService.listProposalFiles("Informática").subscribe({
      next: (fileList) => {
        console.log(fileList)
        const treeStructure = this.crearArboles(fileList);
        console.log(treeStructure)
        this.dataSource.data = treeStructure
      }
    });
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  ngOnInit(): void {
    
      
      

  }

  hasPdfExtension(str: string): boolean {
    const regex = /\.pdf$/;
    return regex.test(str);
  }

  crearArboles(rutas: string[]): TreeNode[] {
    const arboles: TreeNode[] = [];

    // Creamos un mapa para almacenar los árboles por ruta raíz
    const arbolesPorRuta = new Map<string, TreeNode>();

    rutas.forEach(ruta => {
      const parts = ruta.split("/");
      const rutaRaiz = parts[0];
      let arbol: TreeNode;

      // Buscamos el árbol en el mapa
      if (arbolesPorRuta.has(rutaRaiz)) {
        arbol = arbolesPorRuta.get(rutaRaiz)!;
      } else {
        // Creamos un nuevo árbol
        arbol = {
          name: rutaRaiz
        };
        arbolesPorRuta.set(rutaRaiz, arbol);
        arboles.push(arbol);
      }

      // Agregamos los nodos hijos al árbol
      let currentNode = arbol;
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if(part != ""){
          currentNode.children = currentNode.children || [];

          if (Array.isArray(currentNode.children)) {
            const existingChildIndex = currentNode.children.findIndex(child => child.name === part);
  
            if (existingChildIndex !== -1) {
              currentNode = currentNode.children[existingChildIndex];
            } else {
              currentNode.children.push({
                name: part
              });
  
              currentNode = currentNode.children[currentNode.children.length - 1];
            }
          } else {
            
            currentNode.children = [currentNode.children, { name: part }];
            currentNode = currentNode.children[1];
          }
        }
        
      }
    });

    return arboles;
  }

  descargarInforme(data: any){
    console.log(data)
    console.log(this.dataSource.data[0])
    let path = null;
    this.dataSource.data.forEach( (treeNode) => {
      const resultado = getFilePath(treeNode,data.name)
      if(resultado != null){
        console.log(resultado)
        path = resultado
        path = path.slice(1)
        this.documentService.downloadFileFromRoot(path).subscribe({
          next: (fileData) => {
            console.log(fileData)
          }
        })
      }
    })
    
    console.log(path);

    
    
  }

}
