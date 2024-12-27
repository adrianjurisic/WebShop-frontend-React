import React from 'react';
import { Container, Card, Row, Col, Button, Form} from 'react-bootstrap';
import { faAdd, faBackward, faImages, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Navigate, useParams } from 'react-router-dom';
import api, {apiFile, ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.config';

interface AdministratorAddPhotoState {
    isAdministratorLoggedIn: boolean;
    photos: PhotoType[];
}

function withRouter(Component: React.ComponentType<any>) {
    return (props: any) => {
        const params = useParams();
        return <Component {...props} params={params} />;
    };
}

class AdministratorAddPhoto extends React.Component<{ params: { aId: string } }> {
    state: AdministratorAddPhotoState;

    constructor(props: { params: { aId: string } }) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            photos: [],
        };

        this.doUpload = this.doUpload.bind(this);
        this.uploadArticlePhoto = this.uploadArticlePhoto.bind(this);
    }
    
    componentDidMount() {
        this.getPhotos();
    }

    componentDidUpdate(oldProps: { params: { aId: string } }) {
        if (oldProps.params.aId === this.props.params.aId) {
            return;
        }
        this.getPhotos();
    }

    private getPhotos() {
        api(`/api/article/${this.props.params.aId}/?join=photos`, 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.setState(Object.assign(this.state, {
                photos: res.data.photos,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Navigate to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RolledMainMenu role="administrator" />

                <Card>
                    <Card.Header className='mb-3 fs-4 fw-bold'>
                        <Link to="/administrator/dashboard/article/"
                              className="btn btn-sm btn-secondary">
                            <FontAwesomeIcon icon={ faBackward } /> Back to articles
                        </Link>
                        <Card.Title className='mb-3 fs-4 fw-bold text-center'>
                            <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>
                    </Card.Header>

                    <Card.Body className="py-4">
                        <Row>
                            {this.state.photos.map(this.printSinglePhoto, this)}
                        </Row>
                    </Card.Body>

                    <Card.Footer>
                        <Form>
                            <p>
                                <strong>
                                    Add a new photo for this article
                                </strong>
                            </p>
                            <Form.Group>
                                <Form.Label htmlFor='add-photo'>
                                    Add article photo
                                </Form.Label>
                                <Form.Control id='add-photo' type='file'/>
                            </Form.Group>
                            <Form.Group className='mt-4'>
                                <Button variant='primary' onClick={this.doUpload}>
                                    <FontAwesomeIcon icon={faAdd}/> UPLOAD
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }

    private printSinglePhoto (photo: PhotoType){
        return (
            <Col xs={12} sm={6} md={4} lg={3}>
                <Card>
                    <Card.Body>
                        <img alt={"Photo " + photo.photoId}
                             src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath}
                             className='w-100'/>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-center">
                        {this.state.photos.length > 1 ? (
                            <Button variant='danger' onClick={() => this.deletePhoto(photo.photoId)}>
                                <FontAwesomeIcon icon={faRemove}/> DELETE
                            </Button>
                        ) : ''}
                    </Card.Footer>
                </Card>
            </Col>
        )
    }

    private async doUpload() {
        const filePicker: any = document.getElementById('add-photo');

        if(filePicker?.files.length === 0){
            return;
        }

        const file = filePicker.files[0];
        await this.uploadArticlePhoto(Number(this.props.params.aId), file);
        filePicker.value = '';

        this.getPhotos();
    }

    private async uploadArticlePhoto(articleId: number, file: File){
        return await apiFile('api/article/' + articleId + '/uploadPhoto/', 'photo', file, 'administrator')
    }

    private deletePhoto(photoId: number){
        if(!window.confirm('Are You sure?')){
            return;
        }

        api('/api/article/' + this.props.params.aId + '/deletePhoto/' + photoId + '/', 'delete', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.getPhotos();
        })
    }
}

export default withRouter(AdministratorAddPhoto);

