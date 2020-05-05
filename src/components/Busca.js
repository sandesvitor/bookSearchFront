import React, { Component } from 'react'

export default class Busca extends Component {    
    constructor(props) {
        super(props)

        this.state = {
            nome_autor: "",
            lista_titulos: [], 
            lista_info: [],
            showButton: false
        }

        this.buscar = this.buscar.bind(this)
        this.downloadTitles = this.downloadTitles.bind(this)
    }

    buscar() {               
        
        const base_url = process.env.REACT_APP_API_URL
        let url = `${base_url}/${this.state.nome_autor}`

        fetch(url)
        .then(res =>{
            if (res.status === 200) {
                this.setState({showButton: true})
                return res.json()      // corrigir tratamento de erros vindos do servidor!
                
            }
            this.setState({showButton: false})
            return null

        })
        .then(json=> {
            
            this.setState({lista_info: json})

            let array_titulos = []

            for (let titulo in json) {
                
                array_titulos.push(json[titulo]['titulo'])
                
            }
            
            this.setState({lista_titulos: array_titulos}) 
                        
        })

        
    }

    downloadTitles() {  
        const data = this.state.lista_info.map(row => ({
            titulo: row.titulo,
            data: row.data,
            pages: row.pages,
            preço: row.preço,
            link_compra: row.link_compra
        }))
        
        const csvRows = []

        // get headers
        const headers = Object.keys(data[0])
        csvRows.push(headers.join(','))

        // loop over rows
        for (const row of data){
            const values = headers.map(header => {
                const escaped = (''+row[header]).replace(/"/g, '\\"') // regex par escapar caso tenha aspas dentro do objeto
                return `"${escaped}"`
            })
            csvRows.push(values.join(','))
        }

            const csvData = csvRows.join('\n')
            

        const blob = new Blob([csvData], { type: 'text/csv' })
        const obj_urlVersion = global.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('hidden', '')
        a.setAttribute('href', obj_urlVersion)
        a.setAttribute('download', 'dowload.csv')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        // aprimorar esse código para React! Retirar essa criação de elemento!
        
    }


    render() {
        return (
            <React.Fragment>
                
                <div className="busca">
                    <input type="text" id="texto_busca" placeholder="Name your author" onChange={(event)=>{this.setState({nome_autor: event.target.value})}}></input>
                    <input type="button" id="botao-busca" value="Search" onClick = {this.buscar}></input>
                </div>
            
                {this.state.showButton
                    ? <div><button id="botao-download" onClick={()=>this.downloadTitles()}>Download .CVS</button></div>
                    : null
                }                    
            
                <ul>
                    {this.state.lista_titulos
                    ?  this.state.lista_titulos.map((titulo, indice)=> {
                        return <li key={ indice }>{titulo}</li>})
                    : "Something's not right, my dude...(Error: 404)"
                    }               
                </ul>
            </React.Fragment>
        )
    }

}


