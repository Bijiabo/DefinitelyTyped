// Type definitions for @mapbox/mapbox-gl-draw 1.2
// Project: https://github.com/mapbox/mapbox-gl-draw
// Definitions by: Tudor Gergely <https://github.com/tudorgergely>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Feature, GeoJSON, FeatureCollection, Geometry, Point, Position, BBox } from 'geojson';
import { IControl } from 'mapbox-gl';

declare namespace mapboxdraw {
    type DrawMode = typeof MapboxDraw.modes;

    interface MapboxDrawControls {
        point?: boolean;
        line_string?: boolean;
        polygon?: boolean;
        trash?: boolean;
        combine_features?: boolean;
        uncombine_features?: boolean;
    }

    interface DrawActionableState {
        trash: boolean;
        combineFeatures: boolean;
        uncombineFeatures: boolean;
    }

    interface DrawFeature {
        changed(): void;

        incomingCoords(coords: Position): void;

        setCoordinates(coords: Position): void;

        getCoordinates(): Position;

        setProperty(property: string, value: any): void;

        toGeoJSON(): GeoJSON;
    }

    interface DrawCreateEvent {
        // Array of GeoJSON objects representing the features that were created
        features: Feature[];
    }

    interface DrawDeleteEvent {
        // Array of GeoJSON objects representing the features that were deleted
        features: Feature[];
    }

    interface DrawCombineEvent {
        deletedFeatures: Feature[]; // Array of deleted features (those incorporated into new multifeatures)
        createdFeatures: Feature[]; // Array of created multifeatures
    }

    interface DrawUncombineEvent {
        deletedFeatures: Feature[]; // Array of deleted multifeatures (split into features)
        createdFeatures: Feature[]; // Array of created features
    }

    interface DrawUpdateEvent {
        features: Feature[]; // Array of features that were updated
        action: string; // Name of the action that triggered the update
    }

    interface DrawSelectionChangeEvent {
        features: Feature[]; // Array of features that are selected after the change
    }

    interface DrawModeChageEvent {
        mode: DrawMode; // The next mode, i.e. the mode that Draw is changing to
    }

    interface DrawActionableEvent {
        actions: DrawActionableState;
    }

    interface DrawCustomModeThis {
        setSelected(features: DrawFeature[]): void;

        setSelectedCoordinates(coords: { coord_path: string; feature_id: string }): void;

        getSelected(): DrawFeature[];

        getSelectedIds(): string[];

        isSelected(id: string): boolean;

        getFeature(id: string): DrawFeature;

        select(id: string): void;

        delete(id: string): void;

        deleteFeature(id: string, opts?: any): void;

        addFeature(feature: DrawFeature): void;

        clearSelectedFeatures(): void;

        clearSelectedCoordinates(): void;

        setActionableState(actionableState: DrawActionableState): void;

        changeMode(mode: DrawMode, opts?: object, eventOpts?: object): void;

        updateUIClasses(opts: object): void;

        activateUIButton(name?: string): void;

        featuresAt(event: Event, bbox: BBox, bufferType: 'click' | 'tap'): DrawFeature[];

        newFeature(geojson: GeoJSON): DrawFeature;

        isInstanceOf(type: string, feature: object): boolean;

        doRender(id: string): void;
    }

    interface DrawCustomMode<CustomModeState = any, CustomModeOptions = any> {
        onSetup(this: DrawCustomModeThis, options: CustomModeOptions): CustomModeState;

        onDrag(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onClick(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onMouseMove(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onMouseDown(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onMouseUp(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onMouseOut(this: DrawCustomModeThis, state: CustomModeState, e: MouseEvent): void;

        onKeyUp(this: DrawCustomModeThis, state: CustomModeState, e: KeyboardEvent): void;

        onKeyDown(this: DrawCustomModeThis, state: CustomModeState, e: KeyboardEvent): void;

        onTouchStart(this: DrawCustomModeThis, state: CustomModeState, e: TouchEvent): void;

        onTouchMove(this: DrawCustomModeThis, state: CustomModeState, e: TouchEvent): void;

        onTouchEnd(this: DrawCustomModeThis, state: CustomModeState, e: TouchEvent): void;

        onTap(this: DrawCustomModeThis, state: CustomModeState, e: TouchEvent): void;

        onStop(this: DrawCustomModeThis, state: CustomModeState): void;

        onTrash(this: DrawCustomModeThis, state: CustomModeState): void;

        onCombineFeature(this: DrawCustomModeThis, state: CustomModeState): void;

        onUncombineFeature(this: DrawCustomModeThis, state: CustomModeState): void;

        toDisplayFeature(
            this: DrawCustomModeThis,
            state: CustomModeState,
            geojson: GeoJSON,
            display: (geojson: GeoJSON) => void,
        ): void;
    }
}

declare class MapboxDraw implements IControl {
    static modes: {
        DRAW_LINE_STRING: 'draw_line_string';
        DRAW_POLYGON: 'draw_polygon';
        DRAW_POINT: 'draw_point';
        SIMPLE_SELECT: 'simple_select';
        DIRECT_SELECT: 'direct_select';
        STATIC: 'static';
    };

    getDefaultPosition: () => string;

    constructor(options?: {
        displayControlsDefault?: boolean;
        keybindings?: boolean;
        touchEnabled?: boolean;
        boxSelect?: boolean;
        clickBuffer?: number;
        touchBuffer?: number;
        controls?: mapboxdraw.MapboxDrawControls;
        styles?: object[];
        modes?: { [modeKey: string]: mapboxdraw.DrawMode | mapboxdraw.DrawCustomMode };
        defaultMode?: string;
        userProperties?: boolean;
    });

    add(geojson: Feature | FeatureCollection | Geometry): string[];

    get(featureId: string): Feature | undefined;

    getFeatureIdsAt(point: { x: number; y: number }): string[];

    getSelectedIds(): string[];

    getSelected(): FeatureCollection;

    getSelectedPoints(): FeatureCollection;

    getAll(): FeatureCollection;

    delete(ids: string | string[]): this;

    deleteAll(): this;

    set(featureCollection: FeatureCollection): string[];

    trash(): this;

    combineFeatures(): this;

    uncombineFeatures(): this;

    getMode(): mapboxdraw.DrawMode;

    changeMode(mode: mapboxdraw.DrawMode): this;
    changeMode(mode: 'simple_select', options?: { featureIds: string[] }): this;
    changeMode(mode: 'direct_select', options: { featureId: string }): this;
    changeMode(
        mode: 'draw_line_string',
        options?: { featureId: string; from: Feature<Point> | Point | number[] },
    ): this;

    setFeatureProperty(featureId: string, property: string, value: any): this;

    onAdd(map: mapboxgl.Map): HTMLElement;

    onRemove(map: mapboxgl.Map): any;
}

export = MapboxDraw;
