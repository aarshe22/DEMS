import React from 'react';

import styles from './manager.css';
import { Row, Col, Tree, Table, Breadcrumb } from 'antd';
import { PathService } from '@/services/path.service';
const { TreeNode, DirectoryTree } = Tree;
import { Upload, Icon, message } from 'antd';
import Link from 'umi/link';
import Axios from 'axios';
import httpAdapter from 'axios';
import { RcFile } from 'antd/lib/upload';
import { QuerystringPipe } from '@/pipes/querystring.pipe';
import CaseTree from '@/components/CaseTree';
import { IView } from '@/interfaces/view.model';
import { IPath } from '@/interfaces/path.model';
import { IFile, IFileViewer } from '@/interfaces/file.model';
import { IFileIdentifier } from '@/interfaces/identifiers.model';
import Utils from '@/services/utils';
import SplitPane from 'react-split-pane';

const { Dragger } = Upload;

var props2 = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info: any) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
export default class ManagerPage extends React.Component<
  { match: any },
  { pathTree?: IPath; views: IView[] }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      views: [],
      pathTree: {
        name: '',
        identifier: {
          organizationKey: this.props.match ? this.props.match.params.organization : '',
          folderKey: this.props.match ? this.props.match.params.case : '',
          pathKey: this.props.match ? decodeURIComponent(this.props.match.params.path || '') : '',
        },
        type: 'ManagerPathModel',
      },
    };
  }
  onSelect = (keys: any, event: any) => {
    // console.log('Trigger Select', keys, event);
  };

  onExpand = (e: any) => {
    // console.log('Trigger Expand', e);
  };
  fetchDirectory() {
    var me = this;
    if (this.props) {
      new PathService()
        .getPathPage({
          organizationKey: this.props.match.params.organization,
          folderKey: this.props.match.params.case,
          pathKey: decodeURIComponent(this.props.match.params.path || ''),
        })
        .then(value => {
          console.log(value.data.response);
          if (value.data.response) {
            // console.log("COOL",value.data.response.views,value.data.response.pathTree);
            this.setState({
              pathTree: value.data.response.pathTree,
              views: value.data.response.views,
            });
            // (this.pathTreeRef.current as CaseTree).forceUpdate();
          }
        });
    }
  }
  componentDidMount() {
    this.fetchDirectory();
  }
  componentWillReceiveProps() {
    this.fetchDirectory();
  }
  // mapTreeNodeToComponent(node: any, top: boolean = false): any {
  //   var self = this;
  //   // console.log(node.name, node.fullPath);
  //   return (
  //     <TreeNode
  //       title={
  //         <Link
  //           to={
  //             `/manager/${this.props.match.params.organization}/${this.props.match.params.case}/` +
  //             encodeURIComponent(node.fullPath)}
  //           onClick={() => {
  //             this.props.match.params.path = node.fullPath;
  //             self.fetchDirectory();
  //           }}
  //         >
  //           {top ? 'Case Files' : node.name}
  //         </Link>
  //       }
  //       key={node.fullPath}
  //     >
  //       {node.paths &&
  //         node.paths.map((x: any) => {
  //           return self.mapTreeNodeToComponent(x);
  //         })}
  //     </TreeNode>
  //   );
  // }
  fileGrid(view: any) {
    var self = this;
    // console.log(view.rows);
    var cms = [
      {
        keyName: 'name',
        label: 'Name',
        isSortable: true,
      },
      {
        keyName: 'modified',
        label: 'Date Modified',
        isSortable: true,
      },
      {
        keyName: 'viewerType',
        label: 'Type',
        isSortable: true,
      },
      {
        keyName: 'lengthForHumans',
        label: 'Size',
        isSortable: true,
      },
    ].map((x: any) => ({ title: x.label, dataIndex: x.keyName })); //view.gridColumns.map((x:any)=>({title:x.label,dataIndex:x.keyName}));
    return (
      <Table
        dataSource={view.rows.map((x: IFile | IPath) => {
          var r = {
            key: (x as IPath).type
              ? (x as IPath).identifier.pathKey
              : (x as IFile).identifier.fileKey,
          };
          for (var q of cms) {
            (r as any)[q.dataIndex] = (x as any)[q.dataIndex];
          }
          if ((x as any).type == 'ManagerPathModel') {
            var p = x as IPath;
            (r as any).name = (
              <Link
                to={Utils.urlFromPathIdentifier(p.identifier)}
                onClick={() => {
                  this.props.match.params.path = p.identifier.pathKey;
                  self.fetchDirectory();
                }}
              >
                <Icon type="folder"></Icon> {(r as any).name}
              </Link>
            );
          } else if ((x as any).type == 'ManagerFileModel') {
            var f = x as IFile;
            if ((x as any).icons) {
              (r as any).name = (
                <span>
                  <Icon type={Utils.mapFileIconToAnt((x as any).icons[0])}></Icon> {(r as any).name}
                </span>
              );
            }
            // console.log(f.views as IFileViewer[]);
            (r as any).name = (
              <Link
                to={Utils.urlFromFileViewIdentifier(
                  f.identifier,
                  decodeURIComponent(this.props.match.params.path || ''),
                  (f.views as IFileViewer[])[0],
                )}
                onClick={() => {
                  // console.log(f.views as IFileViewer[]);
                  // this.props.match.params.path = x.identifier.pathKey;
                  // self.fetchDirectory();
                }}
              >
                {(r as any).name}
              </Link>
            );
          }
          return r;
        })}
        columns={cms}
      />
    );
  }
  render() {
    var self = this;
    var gridView = this.state.views.filter(x => x.type == 'Grid')[0];
    var path = this.props.match ? decodeURIComponent(this.props.match.params.path || '') : '';
    var pathList = path.split('/');
    if (path === '') {
      pathList = [];
    }
    return (
      // <div className={styles.normal}>
      <SplitPane
        split="vertical"
        minSize={200}
        defaultSize={300}
        resizerClassName={styles.Resizer + ' ' + styles.vertical}
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      >
        <div>
          <CaseTree manager={this} pathTree={() => this.state.pathTree}></CaseTree>
        </div>
        <div>
          <div style={{ padding: 16, paddingBottom: 0 }}>
            <Breadcrumb>
              {/* <Breadcrumb.Item href="">
                <Icon type="home" />
              </Breadcrumb.Item> */}
              <Breadcrumb.Item>
                <Link
                  to={Utils.urlFromPathIdentifier({
                    organizationKey: this.props.match.params.organization,
                    pathKey: '',
                    folderKey: this.props.match.params.case,
                  })}
                  onClick={() => {
                    this.props.match.params.path = '';
                    self.fetchDirectory();
                  }}
                >
                  <Icon type="user" />
                  <span> Case Root</span>
                </Link>
              </Breadcrumb.Item>
              {pathList.map((x, i) => (
                <Breadcrumb.Item key={i}>
                  <Link
                    to={Utils.urlFromPathIdentifier({
                      organizationKey: this.props.match.params.organization,
                      pathKey: pathList.slice(0, i + 1).join('/'),
                      folderKey: this.props.match.params.case,
                    })}
                    onClick={() => {
                      this.props.match.params.path = pathList.slice(0, i + 1).join('/');
                      self.fetchDirectory();
                    }}
                  >
                    {x}
                  </Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>

            <div style={{ paddingTop: 16 }}>{gridView && this.fileGrid(gridView)}</div>
          </div>
          <div style={{ padding: 16, paddingTop: 0 }}>
            {this.props.match && (
              <Dragger
                {...props2}
                action={(file: RcFile) => {
                  var headers = {};
                  (headers as any)['Content-Disposition'] =
                    'attachment; filename="' + file.name + '"';
                  (headers as any)['Content-Range'] =
                    'bytes 0-' + (file.size - 1) + '/' + file.size;

                  return Axios.post(
                    '/api/upload?pathIdentifier.organizationKey=' +
                      this.props.match.params.organization +
                      '&pathIdentifier.folderKey=' +
                      this.props.match.params.case +
                      (this.props.match.params.path
                        ? '&pathIdentifier.pathKey=' + this.props.match.params.path
                        : '') +
                      ['lastModified', 'lastModifiedDate', 'name', 'size', 'type']
                        .map((k: string) => '&fileInformation.' + k + '=' + (file as any)[k])
                        .join(''),
                    file,
                    { headers: headers },
                  )
                    .finally(() => {
                      self.fetchDirectory();
                    })
                    .then(x => '' + x);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Dragger>
            )}
          </div>
        </div>
      </SplitPane>
      // </div>
    );
  }
}
