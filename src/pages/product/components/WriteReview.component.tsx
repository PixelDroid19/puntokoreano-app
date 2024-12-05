import TextArea from "antd/es/input/TextArea";
import CountReview from "../../store/components/CountReview.component";
import { Form, Input } from "antd";

const WriteRaiting = () => {
    return (
        <div className="my-4">
            <h2 className="text-center text-lg font-bold sm:text-start xl:text-2xl">Añadir un comentario</h2>
            <div>
                <CountReview userRating />
                <Form size="large">
                    <Form.Item rules={[{ required: true }]}>
                        <TextArea className="mt-4" placeholder="Su comentario..." rows={3} />
                    </Form.Item>
                    <div className="sm:flex sm:gap-5">
                        <Form.Item rules={[{ required: true }]} className="sm:w-1/2">
                            <Input placeholder="Su nombre..." />
                        </Form.Item>
                        <Form.Item rules={[{ type: 'email', required: true }]} className="sm:w-1/2">
                            <Input placeholder="Su  email..." />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <button type="submit" className="bg-[#E2060F] transition-[background-color] duration-300 hover:bg-[#001529] text-white py-2 px-4 rounded-full font-semibold" >
                            ENVIAR
                        </button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}
export default WriteRaiting;