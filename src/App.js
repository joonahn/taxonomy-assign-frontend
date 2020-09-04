import React, { Component } from 'react';
import './App.css';
import DeleteIcon from './components/DeleteIcon'
import LogIcon from './components/LogIcon'
import { Container, Header, Menu, Form, Table, Button, Icon, Modal } from 'semantic-ui-react'
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'

import 'react-fine-uploader/gallery/gallery.css'
import 'semantic-ui-css/semantic.min.css'
import { getAssignResult, uploaderUrl, downloadUrl, appendJob } from './remote';
import { primerseq_option, taxalg_options, rdpdb_options, conflevel_options, trlen_options, defaultTaxonomyOptions } from './validators/TaxonomyOptions.js'
import { taxonomyOptionValidator } from './validators/TaxonomyOptionValidator.js'


const uploader = new FineUploaderTraditional({
  options: {
    chunking: {
      enabled: true
    },
    deleteFile: {
      enabled: true,
      endpoint: uploaderUrl
    },
    request: {
      endpoint: uploaderUrl
    },
    retry: {
      enableAuto: true
    }
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedstate:false,
      resultData:[],
      intervalId:null,
      uploadedFile:[],
      formData: defaultTaxonomyOptions,
      isLoading: false,
    }
    
    uploader.on('complete', (id, name, response) => {
      this.setState({
        uploadedFile: [
          ...this.state.uploadedFile,
          {
            id: id,
            name: name,
            uuid: uploader.methods.getUuid(id),
          }
        ]
      })
    })

    uploader.on('delete', (id) => {
      this.setState({
        uploadedFile: this.state.uploadedFile.filter((value) => value.id !== id),
      })
    })
    this.galleryRef = React.createRef()
  }

  resetFormData() {
    for(let uploadedFile of this.state.uploadedFile) {
      this.galleryRef.current._removeVisibleFile(uploadedFile.id)
    }
    uploader.methods.reset()
    this.setState({
      formData: defaultTaxonomyOptions,
      uploadedFile: [],
    })
  }

  handleChange = (e, {name, value}) => {
    this.setState({formData:{...this.state.formData, [name]: value}})
    console.log(name, value)
  }

  handleCheck = (e, {name, checked}) => {
    let matchOptionList = this.state.formData.match_option
    let isNameInState = matchOptionList.includes(name)
    if (!checked && isNameInState) {
      this.setState({
        formData: {
          ...this.state.formData,
          match_option: matchOptionList.filter((value) => value !== name)
        }
      })
    } else if (checked && !isNameInState) {
      this.setState({
        formData: {
          ...this.state.formData,
          match_option: [...matchOptionList, name]
        }
      })
    }
  }

  onSubmit = () => {
    if(!taxonomyOptionValidator(this.state.formData)) {
      // ERROR
    }
    var data = {
      ...this.state.formData,
      filepaths: this.state.uploadedFile.map((item) => `${item.uuid}/${item.name}`).join(),
    }
    console.log("data:", data)
    appendJob(data).then(()=> {
      this.resetFormData()
      this.fetchResultData()
    })
  }

  fetchResultData = () => {
    this.setState({
      isLoading: true
    })
    getAssignResult()
      .then((result) => {
        this.setState({
          resultData: result,
          isLoading: false
        })
      })
  }

  componentDidMount() {
    this.fetchResultData()
    let intervalId = setInterval(this.fetchResultData, 30000)
    this.setState({intervalId: intervalId})
    document.title = "Taxonomy Assigner"
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const sortFcn = (a, b) => (a.created_time < b.created_time) ? 1 : ((b.created_time < a.created_time) ? -1 : 0)
    const resultTableBody = this.state.resultData.sort(sortFcn).map((data) => {
      console.log(data.id)
      return (
        <Table.Row key={data.id} positive={data.job_state==='FINISHED'} negative={data.job_state==='FAILED'}>
          <Table.Cell>
            <Modal
              trigger={<div>{data.task_name}</div>}
              header="Job info"
              content={<div class="content"><pre>{JSON.stringify(data, null, 2)}</pre></div>}
              actions={[{ key: 'close', content: 'Close', positive: true }]}/>
          </Table.Cell>
          <Table.Cell>{data.job_state}</Table.Cell>
          <Table.Cell><a href={`${downloadUrl}/${data.result_path}`}>{data.result_path}</a></Table.Cell>
          <Table.Cell>{data.created_time}</Table.Cell>
          <Table.Cell collapsing><DeleteIcon dataId={data.id} onFininshed={this.fetchResultData} state={data.job_state}/></Table.Cell>
          <Table.Cell collapsing><LogIcon dataId={data.id} onFininshed={this.fetchResultData} logdir={data.log_path}/></Table.Cell>
        </Table.Row>
      )
    });
    return (
      <div className="App">
        <Menu fixed='top' inverted>
          <Container>
            <Menu.Item as='a' header>
              Taxonomy Assigner  
             </Menu.Item>
            <Menu.Item as='a' href="http://best.postech.ac.kr">BEST Lab.</Menu.Item>
          </Container>
        </Menu>
        <Container style={{ marginTop: '7em' }} text>
          <Header as='h1'>Taxonomy Assign</Header>
          <Gallery uploader={uploader} ref={this.galleryRef}/>
          
          <Form style={{ marginTop: '2em' }}>

            <Form.Field>
              <Form.Input fluid label='Task name' placeholder='' name='taskname' value={this.state.formData.taskname} onChange={this.handleChange}/>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Primer sequence' name='primerseq' options={primerseq_option} value={this.state.formData.primerseq} onChange={this.handleChange}/>
            </Form.Field>

            <Form.Field>
              <Form.Group grouped>
                <label>Match option</label>
                <Form.Checkbox name='fwd' label='Forward Primer' checked={this.state.formData.match_option.includes('fwd')} onChange={this.handleCheck}/>
                <Form.Checkbox name='rev' label='Reverse Primer' checked={this.state.formData.match_option.includes('rev')} onChange={this.handleCheck}/>
                <Form.Checkbox name='full' label='Full length' checked={this.state.formData.match_option.includes('full')} onChange={this.handleCheck}/>
              </Form.Group>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Taxonomy assign algorithm' name='taxalg' options={taxalg_options} value={this.state.formData.taxalg} onChange={this.handleChange}/>
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='RDP Database' name='rdpdb' options={rdpdb_options} value={this.state.formData.rdpdb} onChange={this.handleChange} />
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Confidency level' name='conflevel' options={conflevel_options} value={this.state.formData.conflevel} onChange={this.handleChange} />
            </Form.Field>

            <Form.Field>
              <Form.Select fluid label='Truncate length' name='trlen' options={trlen_options} value={this.state.formData.trlen} onChange={this.handleChange} />
            </Form.Field>

            <Form.Field>
              <Button fluid icon primary
                labelPosition = 'right'
                onClick={this.onSubmit}
                disabled={this.state.uploadedFile.length === 0}>
                Submit
                <Icon name='right arrow' />
              </Button>
            </Form.Field>

            <Form.Field>
              <Button fluid icon
                onClick={this.resetFormData.bind(this)}
                labelPosition = 'right'>
                Reset
                <Icon name='right arrow' />
              </Button>
            </Form.Field>

          </Form>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Task Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Link</Table.HeaderCell>
                <Table.HeaderCell>Created Time</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {resultTableBody}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='6'>
                <Button
                  content="&nbsp;Refresh"
                  icon='refresh'
                  loading={this.state.isLoading}
                  onClick={()=>{this.fetchResultData()}}/>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
          <br/>
        </Container>

      </div>
    );
  }
}

export default App;
