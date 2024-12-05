import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ENDPOINTS from "@/api/index.js";

type FieldType = {
  brand: string;
  model: string;
  family: string;
  transmission: string;
  fuel: string;
  line: string;
};

const FilterStore = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    brand: "ssangyong",
    model: "",
    family: "",
    transmission: "",
    fuel: "",
    line: "",
  });

  // Generación estática de años
  const modelYears = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
    const year = 2003 + i;
    return { label: `${year}`, value: `${year}` };
  });

  // Fetch de datos del API
  const { data: filterData } = useQuery({
    queryKey: ["getFilters"],
    queryFn: () =>
      axios.get(ENDPOINTS.FILTERS.GET_ALL.url).then((resp) => resp.data),
  });

  // Funciones para obtener opciones de los filtros
  const getFamilyOptions = () => {
    if (!filters.model) return [];
    return filterData?.data?.families?.[filters.model] || [];
  };

  const getTransmissionOptions = () => {
    if (!filters.model || !filters.family) return [];
    return (
      filterData?.data?.transmissions?.[filters.model]?.[filters.family] || []
    );
  };

  const getFuelOptions = () => {
    if (!filters.model || !filters.family || !filters.transmission) return [];
    return (
      filterData?.data?.fuels?.[filters.model]?.[filters.family]?.[
        filters.transmission
      ] || []
    );
  };

  const getLineOptions = () => {
    if (
      !filters.model ||
      !filters.family ||
      !filters.transmission ||
      !filters.fuel
    )
      return [];
    return (
      filterData?.data?.lines?.[filters.model]?.[filters.family]?.[
        filters.transmission
      ]?.[filters.fuel] || []
    );
  };

  // Manejador de cambios en los filtros
  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    const updates = {
      model: () => ({
        model: value,
        family: "",
        transmission: "",
        fuel: "",
        line: "",
      }),
      family: () => ({
        family: value,
        transmission: "",
        fuel: "",
        line: "",
      }),
      transmission: () => ({
        transmission: value,
        fuel: "",
        line: "",
      }),
      fuel: () => ({
        fuel: value,
        line: "",
      }),
      line: () => ({
        line: value,
      }),
    };

    setFilters((prev) => ({
      ...prev,
      ...(updates[filterType]
        ? updates[filterType]()
        : { [filterType]: value }),
    }));
  };

  return (
    <div className="bg-[url('/images/filter_background.png')] w-full h-fit bg-center 2xl:bg-contain">
      <div className="w-full p-10 sm:w-96 sm:mx-auto lg:w-[500px] 2xl:w-[600px]">
        <Form layout="vertical">
          <h1 className="text-2xl text-center font-bold w-full mb-5 2xl:text-3xl">
            Encuentra tus repuestos Ssangyong fácilmente
          </h1>

          <Form.Item<FieldType>
            label="Modelo"
            name="model"
            required
            className="font-bold"
          >
            <Select
              value={filters.model}
              options={modelYears}
              onChange={(value) => handleFilterChange("model", value)}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Familia"
            name="family"
            required
            className="font-bold"
          >
            <Select
              value={filters.family}
              options={getFamilyOptions()}
              onChange={(value) => handleFilterChange("family", value)}
              disabled={!filters.model}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Caja de cambios"
            name="transmission"
            required
            className="font-bold"
          >
            <Select
              value={filters.transmission}
              options={getTransmissionOptions()}
              onChange={(value) => handleFilterChange("transmission", value)}
              disabled={!filters.family}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Combustible"
            name="fuel"
            required
            className="font-bold"
          >
            <Select
              value={filters.fuel}
              options={getFuelOptions()}
              onChange={(value) => handleFilterChange("fuel", value)}
              disabled={!filters.transmission}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Linea"
            name="line"
            required
            className="font-bold"
          >
            <Select
              value={filters.line}
              options={getLineOptions()}
              onChange={(value) => handleFilterChange("line", value)}
              disabled={!filters.fuel}
            />
          </Form.Item>

          <Button
            type="primary"
            className="mx-auto block"
            onClick={() => navigate("/store")}
            disabled={!Object.values(filters).every(Boolean)}
          >
            Buscar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FilterStore;
