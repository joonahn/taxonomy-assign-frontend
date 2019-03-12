import React, { Component } from 'react';
import './App.css';
import { Container, Header, Image, Menu, Dropdown, Form, Table } from 'semantic-ui-react'
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'

import 'react-fine-uploader/gallery/gallery.css'
import 'semantic-ui-css/semantic.min.css'

const primerseq_option = [
  { key: 'Archaea', text: 'Archaea', value: 'Archaea' },
  { key: 'Bacteria', text: 'Bacteria', value: 'Bacteria' },
  { key: 'Prokaryotes', text: 'Prokaryotes', value: 'Prokaryotes' }
]

const taxalg_options = [
  { key: 'RDP', text: 'RDP', value: 'RDP' },
  { key: 'BLAST', text: 'BLAST', value: 'BLAST' },
  { key: 'UCLUST', text: 'UCLUST', value: 'UCLUST' },
]

const rdpdb_options = [
  { key: 'greengenes', text: 'greengenes', value: 'greengenes' },
  { key: 'silva', text: 'silva', value: 'silva' },
  { key: 'unite', text: 'unite', value: 'unite' },
]

const conflevel_options = [
  { key: '0.9', text: '0.9', value: '0.9' },
  { key: '0.8', text: '0.8', value: '0.8' },
  { key: '0.7', text: '0.7', value: '0.7' },
  { key: '0.6', text: '0.6', value: '0.6' },
  { key: '0.5', text: '0.5', value: '0.5' },
  { key: '0.4', text: '0.4', value: '0.4' },
  { key: '0.3', text: '0.3', value: '0.3' },
  { key: '0.2', text: '0.2', value: '0.2' },
  { key: '0.1', text: '0.1', value: '0.1' },
]

const trlen_options = [
  { id: 'nt', value: 'nt', text: 'Not truncate' },
  { id: '200', value: '200', text: '200bp' },
  { id: '250', value: '250', text: '250bp' },
]

const uploader = new FineUploaderTraditional({
  options: {
    chunking: {
      enabled: true
    },
    deleteFile: {
      enabled: true,
      endpoint: 'http://localhost:8000/upload'
    },
    request: {
      endpoint: 'http://localhost:8000/upload'
    },
    retry: {
      enableAuto: true
    }
  }
})

uploader.on('complete', (id, name, response) => {
  console.log(id, name, response)
})

uploader.on('submit', (id, name) => {
  console.log(id, name)
})

uploader.on('delete', (id) => {
  console.log(id)
})


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {checkedstate:false, resultData:[], intervalId:null}
  }

  componentDidMount() {
    var vm = this;
    function fetchResultData(){
      fetch("http://asdf:8787/list")
        .then(res => res.json())
        .then((result) => {
          vm.setState({
            resultData: result
          })
        })
      return fetchResultData
    }
    let intervalId = setInterval(fetchResultData(), 30000)
    this.setState({intervalId: intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const resultTableBody = this.state.resultData.map((data) => {
      console.log(data.id)
      return (
        <Table.Row key={data.id} positive={data.job_state==='FINISHED'} negative={data.job_state==='FAIED'}>
          <Table.Cell>{data.task_name}</Table.Cell>
          <Table.Cell>{data.job_state}</Table.Cell>
          <Table.Cell>{data.result_path}</Table.Cell>
          <Table.Cell>{data.created_time}</Table.Cell>
        </Table.Row>
      )
    });
    return (
      <div className="App">
        <Menu fixed='top' inverted>
          <Container>
            <Menu.Item as='a' header>
              <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
              Project Name
             </Menu.Item>
            <Menu.Item as='a'>Home</Menu.Item>

            <Dropdown item simple text='Dropdown'>
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                  <i className='dropdown icon' />
                  <span className='text'>Submenu</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>
        <Container style={{ marginTop: '7em' }} text>
          <Header as='h1'>Taxonomy Assign</Header>
          <Gallery uploader={uploader} />
          
          <Form style={{ marginTop: '2em' }}>

            <Form.Field>
              <Form.Input fluid label='Task name' placeholder='' name='taskname'/>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Primer sequence' name='primerseq' options={primerseq_option} defaultValue='Bacteria'/>
            </Form.Field>

            <Form.Field>
              <Form.Group grouped>
                <label>Match option</label>
                <Form.Checkbox label='Forward Primer' checked={this.state.checkedstate} onChange={() => this.setState({checkedstate: !this.state.checkedstate})}/>
                <Form.Checkbox label='Reverse Primer' checked={this.state.checkedstate} onChange={() => this.setState({checkedstate: !this.state.checkedstate})}/>
                <Form.Checkbox label='Full length' checked={this.state.checkedstate} onChange={() => this.setState({checkedstate: !this.state.checkedstate})}/>
              </Form.Group>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Taxonomy assign algorithm' name='taxalg' options={taxalg_options} defaultValue='RDP'/>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='RDP Database' name='rdpdb' options={rdpdb_options} defaultValue='greengenes' />
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Confidency level' name='conflevel' options={conflevel_options} defaultValue='0.2' />
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Truncate length' name='trlen' options={trlen_options} defaultValue='nt' />
            </Form.Field>
          </Form>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Task Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Link</Table.HeaderCell>
                <Table.HeaderCell>Created Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {resultTableBody}
            </Table.Body>
          </Table>
        </Container>

      </div>
    );
  }
}

export default App;
