import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CategoryType from '../../types/CategoryType';

class CategoryPage extends React.Component<{ cId: number }, { category?: CategoryType }> {
    constructor(props: { cId: number }) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        this.getCategoryData();
    }

    componentWillReceiveProps(nextProps: Readonly<{ cId: number; }>) {
        if(nextProps.cId === this.props.cId){
            return;
        }
        this.getCategoryData()
    }

    private getCategoryData() {
        setTimeout(() => {
            const data: CategoryType = {
                name: `Category: ${this.props.cId}`,
                categoryId: this.props.cId,
                items: []
            };

            this.setState({ category: data });
        }, 750);
    }

    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> {this.state.category?.name || "Loading..."}
                        </Card.Title>
                        <Card.Text>Here, we will have articles...</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export function CategoryPageWrapper() {
    const { cId } = useParams<{ cId: string }>();
    const numericCId = parseInt(cId || "0", 10);

    return <CategoryPage cId={numericCId} />;
}

export default CategoryPageWrapper;
